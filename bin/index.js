#!/usr/bin/env node

const args = require('../lib/args');

const Showcase = require('../lib/showcase');
const opts = {};

if(args['client.repl'] || args['client.output'] || args['client.events'] || args['client.delay']) {
  opts.client = {};
  if(args['client.repl']) {
    opts.client.repl = args['client.repl'];
  }
  if(args['client.output']) {
    opts.client.output = args['client.output'];
  }
  if(args['client.delay']) {
    opts.client.delay = args['client.delay'];
  }
}

if(args.servedir) {
  opts.serverOptions = {servedir: args.servedir};
}
const showcase = new Showcase(opts);
showcase.showComponent({
  path: args.input,
  open: !opts.client,
  events: args['client.events'],
});