# Showcase

通过命令行快速加载 Vue、React、SpriteJS 组件。

## 特性

- 提供命令行快速加载[Vue3](https://vuejs.org/)和[React](https://reactjs.org/)组件运行于浏览器端，不需要安装额外的编译环境和依赖。
- 内置[esbuild](https://esbuild.github.io/)构建环境，支持模块依赖的自动构建。
- 内置[styled-components](https://github.com/styled-components/styled-components)作为默认css组件化支持。
- 基于[Puppeteer](https://github.com/puppeteer/puppeteer)提供自动渲染能力，输出图片。
- 提供灵活的命令行repl接口进行事件交互。
- 灵活的设计，可以方便地扩展其他组件。

## 用途

- 学习和研究Vue、React等前端组件框架，一键运行，自动加载，不用部署复杂的开发环境。
- 通过命令行参数，可生成图片，用于自动化UI测试。
- 通过命令行repl接口可以进行事件交互，输出结果图片数据，可用于OJ(OnlineJudge)平台的自动判卷。

## 使用方法

### 命令行模式

```bash
> npm i -g jjsc;
> jjsc --input app.vue;
```

访问 http://localhost:3000

**命令行参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| --input | string | 要加载的组件文件 |
| --servedir | string | 运行的http服务的根目录（会影响vue模块加载路径) |
| --client.output | string | 启用puppeteer客户端，将截图保存到 output 文件 |
| --client.repl | boolean | 使用启用repl交互，如启用，puppeteer 客户端也会自动启用 |
| --client.events | string | 启用并发送事件给puppeteer客户端 |
| --client.delay | number | 启用puppeteer客户端，delay毫秒之后再截图，默认值300 |

### NodeJS

**示例**

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

### 用作OJ裁判

通过提供的repl接口可以用来处理OJ，比如：

```
//PREPEND BEGIN
const Showcase = require('jjsc');

const content = `
//PREPEND END

//TEMPLATE BEGIN
//在这里添加组件代码

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
  path: './test/my-component.jsx',
  open: true,
});
//APPEND END
```

这样在OJ的case里面可以这样写：

1.in

```
click button
```

1.out

```
一段base64图片代码
```

