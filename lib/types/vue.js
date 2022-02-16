module.exports = {
  fromText(code) {
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Showcase - Vue3</title>
</head>
  <body>
  <div id="app"></div>
  <script src="https://unpkg.com/vue@next"></script>
  <script src="https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.js"></script>
  <script>

    const options = {
      moduleCache: {
        vue: Vue
      },
      async getFile(url) {
        if(url === './root.vue') {
          return \`${code.replace(/\/script/img, '\\/script')}\`;
        }
        const res = await fetch(url);
        if ( !res.ok )
          throw Object.assign(new Error(res.statusText + ' ' + url), { res });
        return {
          getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
        }
      },
      addStyle(textContent) {

        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
      },
    }

    const { loadModule } = window['vue3-sfc-loader'];

    const app = Vue.createApp({
      components: {
        'root-component': Vue.defineAsyncComponent( () => loadModule('./root.vue', options) )
      },
      template: '<root-component></root-component>'
    });

    app.mount('#app');

  </script>
</body>
</html>`;
    return {
      htmlTemplate,
      serverOptions: {}
    }
  },
  fromFile(path) {
    const fs = require('fs');
    const content = fs.readFileSync(path, {encoding: 'utf-8'});
    return this.fromText(content);
  }
};