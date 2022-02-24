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
    const app = createApp({
      components: {
        'root-component': RootComponent,
      },
      template: '<root-component></root-component>'
    });
    app.mount('#app');
  </script>
</body>
</html>`;
    return {
      htmlTemplate,
      serverOptions: {},
    };
  },
  fromFile(path) {
    // const fs = require('fs');
    // const content = fs.readFileSync(path, {encoding: 'utf-8'});
    // return this.fromText(content);
    const htmlTemplate = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Showcase - Vue3</title>
    </head>
    <body>
      <script type="importmap">
      {
        "imports": {
          "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
        }
      }
      </script>
      <div id="app"></div>
      <!-- index.html -->
      <script type="module">
        import { createApp } from 'vue'
        import MyComponent from './out.js'
      
        createApp(MyComponent).mount('#app')
      </script>
    </body>
</html>`;
    const pluginVue = require('esbuild-plugin-vue-next');
    return {
      htmlTemplate,
      serverOptions: {
        entryPoints: [path],
        outfile: 'out.js',
        external: ['vue'],
        plugins: [pluginVue()],
        format: 'esm',
      },
    };
  },
};