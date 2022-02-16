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
        name: 'server',
        typeLabel: '{underline boolean}',
        description: 'run http server',
      },
      {
        name: 'event',
        typeLabel: '{underline array}',
        description: 'event series',
      },
    ],
  },
];

const usage = commandLineUsage(sections);

const optionDefinitions = [
  {name: 'help'},
  {name: 'input', type: String},
  {name: 'output', type: String},
  {name: 'server', type: Boolean},
  {name: 'event', type: String},
];

const args = commandLineArgs(optionDefinitions);

if('help' in args) {
  console.log(usage);
  process.exit();
}

module.exports = args;