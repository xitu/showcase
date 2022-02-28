# Showcase

[中文说明](README-CN.md)

Quickly load Vue, React components via command line.

## Features

- Provide command line to quickly load [Vue3](https://vuejs.org/) and [React](https://reactjs.org/) components running on the browser. No need to install any build tools and dependencies.
- Built-in [esbuild](https://esbuild.github.io/) support.
- Built-in [styled-components](https://github.com/styled-components/styled-components) as default css module support for react components.
- Use [Puppeteer](ttps://github.com/puppeteer/puppeteer) to provide automatic rendering capability to output images.
- Provides a flexible command line repl interface for event interaction.

## Usage

- Study Vue and React without Build Tools.
- With command line parameters, generate images for automated UI testing.
- The command line REPL interface allows event interaction and output of result data, which can be used in the OJ (OnlineJudge) platforms.

### The command lines

```bash
> npm i -g jjsc;
> jjsc --input app.vue;
```

Visit http://localhost:3000

**Arguments**

| args | type | details |
| --- | --- | --- |
| --input | string | The component to rendered |
| --servedir | string | Http server root |
| --client.output | string | Puppeteer's snapshot filename |
| --client.repl | boolean | Enable REPL |
| --client.events | string | Send events to puppeteer page |
| --client.delay | number | Delay milliseconds before take snapshot |

### NodeJS

**Example**

```js
const Showcase = require('jjsc');

const showcase = new Showcase({
  client: {
    output: './out.png',
    repl: true,
  },
  serverOptions: {
    servedir: 'test',
  },
});

showcase.showComponent({
  path: './test/my-component.jsx',
  open: true,
});
```

### For Online Judger

Use REPL interface, for example:

```
//PREPEND BEGIN
const Showcase = require('jjsc');

const content = `
//PREPEND END

//TEMPLATE BEGIN
//Add component code here...

//TEMPLATE END

//APPEND BEGIN
`.trim();

const showcase = new Showcase({
  silent: true,
  client: {
    repl: true,
  },
});

showcase.showComponent({
  content,
  open: true,
});
//APPEND END
```

In testcase files：

1.in

```
click button
```

1.out

```
The base64 image data...
```

