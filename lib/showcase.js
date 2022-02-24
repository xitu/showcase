const types = require('./types');
const {createServer} = require('./server');
const Client = require('./client');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function activeClient(server, options, events) {
  const {delay, repl, output} = options;
  const {port} = server.options;
  const client = new Client();
  await client.start();
  try {
    await client.goto(`http://localhost:${port}`);
    await sleep(delay); // wait 100ms for execute js;
    if(typeof repl === 'function') {
      await client.repl(repl);
    } else if(repl) {
      await client.repl(async () => {
        const image = await client.screenshot({encoding: 'base64'});
        console.log(image);
      });
    }
    if(events) {
      const commands = events.split(',');
      const eventArgs = [];
      for(let i = 0; i <= commands.length; i++) {
        const command = commands[i];
        if(command == null || client.isEvent(command)) {
          if(eventArgs.length) {
            // eslint-disable-next-line no-await-in-loop
            await client.dispatchEvent(eventArgs[0], null, ...eventArgs.slice(1));
          }
          eventArgs.length = 0;
        }
        eventArgs.push(command);
      }
    }
    if(output) {
      await client.screenshot({path: output});
      if(!options.silent) console.log(`Screenshot image save to ${output}`);
    } else if(!repl && !options.silent) {
      const image = await client.screenshot({encoding: 'base64'});
      console.log(`data:image/png;base64,${image}`);
    }
  } finally {
    await client.stop();
    server.stop();
  }
}

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
    path = null,
    content = null,
    module = null,
    type = this.options.type,
    open = false,
    events = null,
  }) {
    if(!type) {
      if(path && /\.vue$/.test(path)) type = 'vue';
      else type = 'jsx';
    }
    const tpl = types[type];
    if(!tpl) {
      throw new TypeError('Invalid component type.');
    }

    const {htmlTemplate, serverOptions} = content !== null ? types[type].fromText(content, module) : types[type].fromFile(path);
    if(path && !this.options.serverOptions.servedir) {
      this.options.serverOptions.servedir = require('path').dirname(path);
    }
    const serverOpts = Object.assign({open}, this.options.serverOptions, serverOptions);
    let routerMap = htmlTemplate;
    if(content && module) {
      routerMap = {'/': htmlTemplate, [require('path').join('/', module)]: content};
    }
    const server = await createServer(routerMap, serverOpts);
    if(this.options.silent && this.options.serverOptions.silent !== false) serverOpts.silent = true;

    const clientOpt = this.options.client;

    if(clientOpt) {
      await activeClient(server, {...clientOpt, silent: this.options.silent}, events);
    }
  }
}

module.exports = Showcase;