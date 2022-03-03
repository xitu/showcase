/*
  create esbuild server to render components
  */

const esbuild = require('esbuild');
const http = require('http');
const open = require('open');
const path = require('path');
const etag = require('etag');
const fs = require('fs');

const compiler = require('vue/compiler-sfc');

function generateID() {
  return Math.random().toString(36).slice(2, 12);
}

function transformVueSFC(source, filename) {
  const {descriptor, errors} = compiler.parse(source, {filename});
  if(errors.length) throw new Error(errors.toString());
  const id = generateID();
  const hasScoped = descriptor.styles.some(e => e.scoped);
  const scopeId = hasScoped ? `data-v-${id}` : undefined;
  const templateOptions = {
    id,
    source: descriptor.template.content,
    filename: descriptor.filename,
    scoped: hasScoped,
    slotted: descriptor.slotted,
    compilerOptions: {
      scopeId: hasScoped ? scopeId : undefined,
      mode: 'module',
    },
  };
  const script = compiler.compileScript(descriptor, {id, templateOptions});
  const template = compiler.compileTemplate(templateOptions);
  let cssInJS = '';
  if(descriptor.styles) {
    const styled = descriptor.styles.map((style) => {
      return compiler.compileStyle({
        id,
        source: style.content,
        scoped: style.scoped,
        preprocessLang: style.lang,
      });
    });
    if(styled.length) {
      const cssCode = styled.map(s => s.code).join('\n');
      cssInJS = `(function(){const el = document.createElement('style');
el.innerHTML = \`${cssCode}\`;
document.body.appendChild(el);}());`;
    }
  }
  const moduleCode = `${template.code}
${script.content}
;${cssInJS}`.replace(/(export\s+default\s*{)/ig, `$1
  render, 
  __scopeId: '${scopeId}',
  __file: '${filename}',`);
  return moduleCode;
}

const transformCache = {};

function applyTransform({
  req,
  res,
  transform,
  source,
  headers = {'Content-Type': 'text/javascript;charset=UFT-8'},
}) {
  const checkETag = req.headers['if-none-match'];
  const etagHash = etag(source);
  if(checkETag && checkETag === etagHash) {
    res.writeHead(304, headers);
    res.end();
    return;
  }
  headers.ETag = etagHash;
  const {url} = req;
  let resolved = source;
  const cached = transformCache[url];
  if(transform) {
    if(cached) {
      if(cached.ETag === etagHash) {
        resolved = cached.code;
      }
    } else {
      resolved = transform(source, url);
      transformCache[url] = {code: resolved, ETag: etagHash};
    }
  }
  res.writeHead(200, headers);
  res.end(resolved);
}

function reactTransform(source, url) {
  const {ext} = path.parse(url);
  return esbuild.transformSync(source, {loader: ext.slice(1)}).code;
}

function vueSFCTransform(source, url) {
  const {base: filename} = path.parse(url);
  return transformVueSFC(source, filename);
}

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
      let source = routerMap[req.url];
      const matched = /\.((?:j|t)sx|vue)$/.exec(req.url);
      if(matched) {
        const filePath = path.join(servedir, req.url);
        if(!source && !fs.existsSync(filePath)) {
          proxyRes.pipe(res, {end: true});
          return;
        }
        if(!source) source = fs.readFileSync(filePath, {encoding: 'utf-8'});
        const transformType = matched[1];
        applyTransform({
          req,
          res,
          source,
          transform: transformType !== 'vue' ? reactTransform : vueSFCTransform,
        });
      } else if(source) {
        applyTransform({
          req,
          res,
          source,
          headers: {'Content-Type': 'text/html;charset=UFT-8'},
        });
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