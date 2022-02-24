function getContainer(code) {
  const matched = code.match(/document.getElementById\(['"](.*)['"]\)/im);
  let container = '';
  if(matched) {
    container = `<div id="${matched[1]}"></div>`;
  }
  return container;
}

module.exports = {
  fromText(code, module) {
    let scriptSection;
    if(!module) {
      scriptSection = `<script type="text/babel" data-type="module">
        ${code}
      </script>`;
    } else {
      scriptSection = `<script type="text/babel" data-type="module" src="${module}"></script>`;
    }
    const htmlTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Showcase - React</title>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
      <script type="importmap">
      {
        "imports": {
          "react": "https://unpkg.com/@esm-bundle/react/esm/react.development.js",
          "react-dom": "https://unpkg.com/@esm-bundle/react-dom/esm/react-dom.development.js",
          "react-is": "https://unpkg.com/@esm-bundle/react-is/esm/react-is.production.min.js",
          "styled-components": "https://unpkg.com/@esm-bundle/styled-components/esm/styled-components.browser.min.js"
        }
      }
    </script>
    ${getContainer(code)}
    ${scriptSection}
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