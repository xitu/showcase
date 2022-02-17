/*
  create esbuild server to render components
  */

const esbuild = require('esbuild');
const http = require('http');
const open = require('open');

const defaultOptions = {
  servedir: '.',
  port: 3000,
  proxyPort: 8000,
  entryPoints: [],
  bundle: true,
  outfile: 'out.js',
  write: false,
  slient: false,
  open: false,
};

async function createServer(routerMap = {}, options = {}) {
  if(typeof routerMap === 'string') {
    routerMap = {'/': routerMap};
  }
  options = Object.assign({}, defaultOptions, options);

  const {
    servedir, proxyPort, open: autoOpen, slient, port, ...buildOpts
  } = options;
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
      } else {
        proxyRes.pipe(res, {end: true});
      }
    });
    req.pipe(proxyReq, {end: true});
  }).listen(port);

  const website = `http://localhost:${options.port}`;
  if(!slient) console.log(`Showcase is running at ${website}`);
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