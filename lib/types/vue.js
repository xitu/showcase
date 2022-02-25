module.exports = {
  fromText(code, module = 'app.vue') {
    if(!/^[/.]/.test(module)) module = `./${module}`;
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Showcase - Vue3</title>
  <script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
  </script>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createApp } from 'vue';
    import RootComponent from '${module}';
    createApp(RootComponent).mount('#app');
  </script>
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