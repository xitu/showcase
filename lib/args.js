const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const sections = [
  {
    header: 'SHOWCASE',
    content: 'Faster way to render & interact react & vue3 components with command line interface.',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'input',
        typeLabel: '{underline string}',
        description: 'the component file input',
      },
      {
        name: 'servedir',
        typeLabel: '{underline string}',
        description: 'server root dir',
      },
      {
        name: 'client.repl',
        typeLabel: '{underline boolean}',
        description: 'interact with repl commands',
      },
      {
        name: 'client.output',
        typeLabel: '{underline string}',
        description: 'the page image output',
      },
      {
        name: 'client.events',
        typeLabel: '{underline string}',
        description: 'event series, seperate by comma',
      },
      {
        name: 'client.delay',
        typeLabel: '{underline number}',
        description: 'delay some milliseconds before screenshot, default is 300',
      },
    ],
  },
];

const usage = commandLineUsage(sections);

const optionDefinitions = [
  {name: 'help', type: Boolean},
  {name: 'version', type: Boolean},
  {name: 'input', type: String},
  {name: 'servedir', type: String},
  {name: 'client.repl', type: Boolean},
  {name: 'client.output', type: String},
  {name: 'client.events', type: String},
  {name: 'client.delay', type: Number},
];

const args = commandLineArgs(optionDefinitions);
if(Object.keys(args).length <= 0 || 'help' in args) {
  console.log(usage);
  process.exit();
}
if('version' in args) {
  console.log(require('../package.json').version);
  process.exit();
}

module.exports = args;