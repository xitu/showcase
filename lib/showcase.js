const types = require('./types');
const {createServer} = require('./server');
const Client = require('./client');

const defaultOptions = {
  // type: 'jsx',
  silent: false,
  client: null, // client: {repl?Function, output?String}
  serverOptions: {},
};

class Showcase {
  constructor(options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  async showComponent({
    path = null, content = null, type = this.options.type, open = false,
  }) {
    if(!type) {
      if(path && /\.vue$/.test(path)) type = 'vue';
      else type = 'jsx';
    }
    const tpl = types[type];
    if(!tpl) {
      throw new TypeError('Invalid component type.');
    }

    const {htmlTemplate, serverOptions} = content !== null ? types[type].fromText(content) : types[type].fromFile(path);
    const serverOpts = Object.assign({open}, this.options.serverOptions, serverOptions);
    const server = await createServer(htmlTemplate, serverOpts);
    if(this.options.silent && this.options.serverOptions.silent !== false) serverOpts.silent = true;

    const clientOpt = this.options.client;
    const repl = clientOpt && clientOpt.repl;
    const output = clientOpt && clientOpt.output;

    if(clientOpt) {
      const {port} = server.options;
      const client = new Client();
      await client.start();
      await client.goto(`http://localhost:${port}`);
      if(typeof repl === 'function') {
        await client.repl(repl);
      } else if(repl) {
        await client.repl(async () => {
          const image = await client.screenshot({encoding: 'base64'});
          console.log(image);
        });
      }
      if(output) {
        await client.screenshot({path: output});
        if(!this.options.silent) console.log(`Screenshot image save to ${output}`);
      }
      await client.stop();
      server.stop();
    }
  }
}

module.exports = Showcase;