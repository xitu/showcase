function getContainer(code) {
  const matched = code.match(/document.getElementById\(['"](.*)['"]\)/im);
  let container = '';
  if(matched) {
    container = `<div id="${matched[1]}"></div>`;
  }
  return container;
}

module.exports = {
  fromText(code, module = 'app.jsx') {
    if(!/^[/.]/.test(module)) module = `./${module}`;
    const htmlTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Showcase - React</title>
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
    <script type="module" src="${module}"></script>
  </body>
</html>`;

    return {
      htmlTemplate,
      serverOptions: {},
    };
  },
  fromFile(path, servedir) {
    const fs = require('fs');
    const content = fs.readFileSync(path, {encoding: 'utf-8'});
    return this.fromText(content, require('path').relative(servedir, path));
  },
};