const puppeteer = require('puppeteer');

const replCommands = {
  async click(page, selector, delay = 0) {
    return await page.click(selector, {button: 'left', delay: Number(delay)});
  },
  async rclick(page, selector, delay = 0) {
    return await page.click(selector, {button: 'right', delay: Number(delay)});
  },
  async dblclick(page, selector, delay = 0) {
    return await page.click(selector, {button: 'left', clickCount: 2, delay: Number(delay)});
  },
  async tap(page, selector) {
    return await page.tap(selector);
  }
}

class Client {
  constructor(options = {}) {
    this.options = options;
  }
  async start() {
    if(this.browser) {
      await this.stop();
    }
    this.browser = await puppeteer.launch();
  }
  async stop() {
    if(this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
  async goto(url) {
    if(!this.page) this.page = await this.browser.newPage();
    await this.page.goto(url);
  }
  async screenshot(options = {}) {
    const page = this.page;
    const image = await page.screenshot(options);
    return image;
  }
  async click(selector, options = {button: 'left', clickCount: 1, delay: 0}) {
    if(this.page) {
      await this.page.click(selector, options);
    }
  }
  async hover(selector) {
    if(this.page) {
      await this.page.hover(selector);
    }
  }
  async tap(selector) {
    if(this.page) {
      await this.page.tap(selector);
    }
  }
  get mouse() {
    if(this.page) return this.page.mouse;
  }
  get touchscreen() {
    if(this.page) return this.page.touchscreen;
  }
  repl(callback) {
    /*
      command: click、hover、tap、mousedown、mousemove、mouseup、wheel
    */
   if(this.page){
      const promise = new Promise((resolve, reject) => {
        const tasks = [];
        const readline = require('readline');
        const rl = readline.createInterface({ input: process.stdin });
        rl.on('line', async (input) => {
          if (input === '') {
            rl.close();
            await Promise.all(tasks);
            resolve();
          } else {
            const args = input.split(' ');
            const handler = replCommands[args[0]];
            if(handler) {
              const task = handler(this.page, ...args.slice(1));
              tasks.push(task);
              await task;
              if(callback) tasks.push(callback(this, this.page));
            } else {
              reject(new ReferenceError(`unknow command ${args[0]}`));
            }
          }
        });
      });
      return promise;
    }
  }
}

module.exports = Client;