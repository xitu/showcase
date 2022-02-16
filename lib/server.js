/* 
  create esbuild server to render components
  */

const esbuild = require('esbuild');
const http = require('http');

const defaultOptions = {
  servedir: '.',
  port: 3000,
  proxyPort: 8000,
  entryPoints: [],
  bundle: true,
  outfile: 'out.js',
  write: false,
  slient: false,
};

async function createServer(routerMap = {}, options = {}) {
  if(typeof routerMap === 'string') {
    routerMap = {'/': routerMap};
  }
  options = Object.assign({}, defaultOptions, options);

  const result = await esbuild.serve({
    servedir: options.servedir,
    port: options.proxyPort,
  },{
    entryPoints: options.entryPoints,
    bundle: options.bundle,
    outfile: options.outfile,
    write: false,
  });

  const httpServer = http.createServer((req, res) => {
    const options = {
      hostname: result.host,
      port: result.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    }

    const proxyReq = http.request(options, proxyRes => {
      if(req.url in routerMap) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(routerMap[req.url]);
      } else {
        proxyRes.pipe(res, { end: true });
      }
    });
    req.pipe(proxyReq, { end: true });
  }).listen(options.port);

  if(!options.slient) console.log(`Showcase is running at http://localhost:${options.port}`);

  return {options, httpServer, buildServer: result, stop() {
    this.httpServer.close();
    this.buildServer.stop();
  }};
}

module.exports = {createServer};