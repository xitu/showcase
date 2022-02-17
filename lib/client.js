const puppeteer = require('puppeteer');

const replCommands = {
  /* async */
  click(page, selector, delay = 0) {
    return page.click(selector, {button: 'left', delay: Number(delay)});
  },
  /* async */
  rclick(page, selector, delay = 0) {
    return page.click(selector, {button: 'right', delay: Number(delay)});
  },
  /* async */
  dblclick(page, selector, delay = 0) {
    return page.click(selector, {button: 'left', clickCount: 2, delay: Number(delay)});
  },
  /* async */
  tap(page, selector) {
    return page.tap(selector);
  },
  /* async */
  mousedown(page, button = 'left', count = 1) {
    return page.mouse.down({
      button, count: Number(count),
    });
  },
  /* async */
  mouseup(page, button = 'left', count = 1) {
    return page.mouse.up({
      button, count: Number(count),
    });
  },
  /* async */
  mouseclick(page, x, y, button = 'left', count = 1, delay = 0) {
    return page.mouse.click(Number(x), Number(y), {
      button, count: Number(count), delay: Number(delay),
    });
  },
  /* async */
  mousemove(page, x, y, steps = 1) {
    return page.mouse.move(Number(x), Number(y), {
      steps: Number(steps),
    });
  },
  /* async */
  drag(page, startX, startY, targetX, targetY) {
    return page.mouse.drag({
      x: Number(startX),
      y: Number(startY),
    }, {
      x: Number(targetX),
      y: Number(targetY),
    });
  },
  /* async */
  drop(page, targetX, targetY, data = null) {
    return page.mouse.drop({
      x: Number(targetX),
      y: Number(targetY),
    }, {
      data,
    });
  },
  /* async */
  dragdrop(page, startX, startY, targetX, targetY, delay = 0) {
    return page.mouse.dragAndDrop({
      x: Number(startX),
      y: Number(startY),
    }, {
      x: Number(targetX),
      y: Number(targetY),
    }, {
      delay: Number(delay),
    });
  },
  /* async */
  dragenter(page, targetX, targetY, data = null) {
    return page.mouse.dragEnter({
      x: Number(targetX),
      y: Number(targetY),
    }, {
      data,
    });
  },
  /* async */
  dragover(page, targetX, targetY, data = null) {
    return page.mouse.dragOver({
      x: Number(targetX),
      y: Number(targetY),
    }, {
      data,
    });
  },
  /* async */
  wheel(page, deltaX, deltaY) {
    return page.mouse.wheel({
      x: Number(deltaX),
      y: Number(deltaY),
    });
  },
};

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
    if(this.page) {
      const image = await this.page.screenshot(options);
      return image;
    }
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
    return null;
  }

  get touchscreen() {
    if(this.page) return this.page.touchscreen;
    return null;
  }

  repl(callback) {
    /*
      command: click、hover、tap、mousedown、mousemove、mouseup、wheel
    */
    if(this.page) {
      const promise = new Promise((resolve, reject) => {
        const tasks = [];
        const readline = require('readline');
        const rl = readline.createInterface({input: process.stdin});
        rl.on('line', async (input) => {
          if(input === '') {
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