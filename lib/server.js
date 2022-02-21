/*
  create esbuild server to render components
  */

const esbuild = require('esbuild');
const http = require('http');
const open = require('open');
const path = require('path');
const etag = require('etag');

const defaultOptions = {
  servedir: '.',
  port: 3000,
  proxyPort: 8000,
  entryPoints: [],
  bundle: true,
  outfile: 'out.js',
  write: false,
  silent: false,
  open: false,
};

async function createServer(routerMap = {}, options = {}) {
  if(typeof routerMap === 'string') {
    routerMap = {'/': routerMap};
  }
  options = Object.assign({}, defaultOptions, options);

  const {
    servedir, proxyPort, open: autoOpen, silent, port, ...buildOpts
  } = options;
  if(options.servedir && buildOpts.outfile) {
    buildOpts.outfile = path.join(servedir, buildOpts.outfile);
  }
  const result = await esbuild.serve({
    servedir,
    port: proxyPort,
  }, buildOpts);

  const httpServer = http.createServer((req, res) => {
    const opts = {
      hostname: result.host,
      port: result.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(opts, (proxyRes) => {
      if(req.url in routerMap) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(routerMap[req.url]);
        return;
      }
      const matched = /\.((?:j|t)sx)$/.exec(req.url);
      if(matched && !/^http(s?):/.test(req.url)) {
        const content = require('fs').readFileSync(path.join(servedir, req.url), {encoding: 'utf-8'});
        const checkETag = req.headers['if-none-match'];
        const headers = {'Content-Type': 'text/javascript;charset=UFT-8'};
        if(checkETag) {
          const weakETag = etag(content);
          if(checkETag === weakETag) {
            res.writeHead(304, headers);
            res.end();
            return;
          }
        }
        headers.ETag = etag(content);
        const compiled = esbuild.transformSync(content, {loader: matched[1]}).code;
        res.writeHead(200, headers);
        res.end(compiled);
      } else {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, {end: true});
      }
    });
    req.pipe(proxyReq, {end: true});
  }).listen(port);

  const website = `http://localhost:${options.port}`;
  if(!silent) console.log(`Showcase is running at ${website}`);
  if(autoOpen) await open(website);

  return {
    options,
    httpServer,
    buildServer: result,
    stop() {
      this.httpServer.close();
      this.buildServer.stop();
    },
  };
}

module.exports = {createServer};