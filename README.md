# Showcase

通过命令行快速加载 Vue、React、SpriteJS 组件。

## 特性

- 提供命令行快速加载[Vue](https://vuejs.org/)、[React](https://reactjs.org/)和[SpriteJS](http://spritejs.com/)组件运行于浏览器端，不需要安装额外的编译环境和依赖。
- 内置[esbuild](https://esbuild.github.io/)构建环境，支持模块依赖的自动构建。
- 基于[Puppeteer](https://github.com/puppeteer/puppeteer)提供自动渲染能力，输出图片。
- 提供灵活的命令行repl接口进行事件交互。
- 灵活的设计，可以方便地扩展其他组件。

## 用途

- 学习和研究Vue、React等前端组件框架，一键运行，自动加载，不用部署复杂的开发环境。
- 通过命令行参数，可生成图片，用于自动化UI测试。
- 通过命令行repl接口可以进行事件交互，输出结果图片数据，可用于OJ(OnlineJudge)平台的自动判卷。