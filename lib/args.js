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
        name: 'output',
        typeLabel: '{underline string}',
        description: 'the page image output',
      },
      {
        name: 'events',
        typeLabel: '{underline array}',
        description: 'event series',
      },
      {
        name: 'servedir',
        typeLabel: '{underline string}',
        description: 'http server root dir',
      },
      {
        name: 'client',
        typeLabel: '{underline boolean}',
        description: 'Use {underline puppeteer} client.',
      },
      {
        name: 'repl',
        typeLabel: '{underline boolean}',
        description: 'interact with repl commands',
      },
    ],
  },
];

const usage = commandLineUsage(sections);

const optionDefinitions = [
  {name: 'help'},
  {name: 'input', type: String},
  {name: 'output', type: String},
  {name: 'events', type: String},
  {name: 'servedir', type: String},
  {name: 'client', type: Boolean},
  {name: 'repl', type: Boolean},
];

const args = commandLineArgs(optionDefinitions);
if(Object.keys(args).length <= 0 || 'help' in args) {
  console.log(usage);
  process.exit();
}

module.exports = args;