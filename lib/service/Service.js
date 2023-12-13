const path = require("path");
const fs = require("fs");
const log = require("../utils/log");
const { getConfigFile } = require("../utils");
const constant = require("./const");

const HOOK_KEYS = [constant.HOOK_START];

class Service {
  constructor(opts) {
    this.args = opts;
    this.config = {};
    this.hooks = {};
    this.dir = process.cwd();
  }

  async start() {
    await this.resolveConfig();
    this.registerHooks();
    this.emitHooks(constant.HOOK_START);
  }

  async resolveConfig() {
    const { config } = this.args;
    let configFilePath = "";

    if (config) {
      if (path.isAbsolute(config)) {
        configFilePath = config;
      } else {
        configFilePath = path.resolve(config);
      }
    } else {
      configFilePath = getConfigFile({ cwd: this.dir });
    }

    if (configFilePath && fs.existsSync(configFilePath)) {
      const isMjs = configFilePath.endsWith("mjs");
      if (isMjs) {
        this.config = (await import(configFilePath)).default;
      } else {
        this.config = require(configFilePath);
      }
      log.verbose("this.config", this.config);
    } else {
      console.log("配置文件不存在，终止执行");
      process.exit(1);
    }
  }

  registerHooks() {
    const { hooks } = this.config;

    if (hooks && hooks.length > 0) {
      hooks.forEach((hook) => {
        const [key, fn] = hook;
        if (key && fn && HOOK_KEYS.indexOf(key) >= 0) {
          if (typeof key === "string" && typeof fn === "function") {
            const existHook = this.hooks[key];
            if (!existHook) {
              this.hooks[key] = [];
            }
            this.hooks[key].push(fn);
          }
        }
      });
    }

    log.verbose("hooks", this.hooks);
  }

  async emitHooks(key) {
    const hooks = this.hooks[key];

    if (hooks) {
      for (const fn of hooks) {
        try {
          await fn(this);
        } catch (error) {
          log.error(e);
        }
      }
    }
  }
}

module.exports = Service;
