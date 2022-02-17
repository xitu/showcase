function getContainer(code) {
  const matched = code.match(/document.getElementById\(['"](.*)['"]\)/im);
  let container = '';
  if(matched) {
    container = `<div id="${matched[1]}"></div>`;
  }
  return container;
}

module.exports = {
  fromText(code) {
    const htmlTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Showcase - React</title>
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/react-is@16.8.3/umd/react-is.development.js"></script>
    <script src="https://unpkg.com/styled-components/dist/styled-components.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    ${getContainer(code)}
    <script type="text/babel">
      ${code}
    </script>
  </body>
</html>`;

    return {
      htmlTemplate,
      serverOptions: {},
    };
  },
  fromFile(path) {
    const fs = require('fs');
    const code = fs.readFileSync(path, {encoding: 'utf-8'});
    const htmlTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World</title>
  </head>
  <body>
    ${getContainer(code)}
    <script src="/out.js"></script>
  </body>
</html>`;
    return {
      htmlTemplate,
      serverOptions: {
        entryPoints: [path],
        outfile: 'out.js',
      },
    };
  },
};