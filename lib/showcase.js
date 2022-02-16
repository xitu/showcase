const types = require('./types');
const {createServer} = require('./server');
const Client = require('./client');

const defaultOptions = {
  type: 'jsx',
  client: null,  // client: {repl?Function, output?String}
  serverOptions: {},
};

class Showcase {
  constructor(options= {}) {
    this.options = Object.assign({}, defaultOptions, options);
  }
  async showComponent({path = null, content = null, type=this.options.type}) {
    const tpl = types[type];
    if(!tpl) {
      throw new TypeError('Invalid component type.');
    }

    let server;

    if(content !== null) {
      const {htmlTemplate, serverOptions} = types[type].fromText(content);
      server = await createServer(htmlTemplate, Object.assign({}, this.options.serverOptions, serverOptions));
    } else if(path != null) {
      const {htmlTemplate, serverOptions} = types[type].fromFile(path);
      server = await createServer(htmlTemplate, Object.assign({}, this.options.serverOptions, serverOptions));
    }

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
        await client.repl(async (client) => {
          const image = await client.screenshot({encoding: 'base64'});
          console.log(image);
        });
      }
      if(output) {
        await client.screenshot({path: output});
        console.log(`Screenshot image save to ${output}`);
      }
      await client.stop();
      server.stop();
    }
  }
}

module.exports = Showcase;