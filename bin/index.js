#!/usr/bin/env node

const args = require('../lib/args');

const Showcase = require('../lib/showcase');
const opts = {};
if(args.repl) {
  opts.client = {repl: true};
} else if(args.client) {
  opts.client = {output: args.output};
}
const showcase = new Showcase(opts);
showcase.showComponent({
  path: args.input,
  open: !args.client && !args.repl,
  events: args.events,
});