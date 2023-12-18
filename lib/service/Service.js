const path = require("path");
const fs = require("fs");
const log = require("../utils/log");
const { getConfigFile, loadModule } = require("../utils");
const constant = require("./const");

const HOOK_KEYS = [constant.HOOK_START];

class Service {
  constructor(opts) {
    this.args = opts;
    this.config = {};
    this.hooks = {};
    this.plugins = [];
    this.dir = process.cwd();
  }

  async start() {
    await this.resolveConfig();
    await this.registerHooks();
    await this.emitHooks(constant.HOOK_START);
    await this.registerPlugins();
    await this.runPlugins();
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
      this.config = await loadModule(configFilePath);
      log.verbose("this.config", this.config);
    } else {
      console.log("配置文件不存在，终止执行");
      process.exit(1);
    }
  }

  async registerHooks() {
    const { hooks } = this.config;

    if (hooks && hooks.length > 0) {
      for (const hook of hooks) {
        const [key, fn] = hook;
        if (
          key &&
          fn &&
          typeof key === "string" &&
          HOOK_KEYS.indexOf(key) >= 0
        ) {
          if (typeof fn === "function") {
            const existHook = this.hooks[key];
            if (!existHook) {
              this.hooks[key] = [];
            }
            this.hooks[key].push(fn);
          } else if (typeof fn === "string") {
            const newFn = await loadModule(fn);

            if (newFn) {
              const existHook = this.hooks[key];
              if (!existHook) {
                this.hooks[key] = [];
              }
              this.hooks[key].push(newFn);
            }
          }
        }
      }
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

  async registerPlugins() {
    let { plugins } = this.config;
    if (plugins) {
      if (typeof plugins === "function") {
        plugins = plugins();
      }
      if (Array.isArray(plugins)) {
        for (const plugin of plugins) {
          if (typeof plugin === "string") {
            const mod = await loadModule(plugin);
            this.plugins.push({ mod });
          } else if (Array.isArray(plugin)) {
            const [pluginPath, pluginParams] = plugin;
            const mod = await loadModule(pluginPath);
            this.plugins.push({ mod, params: pluginParams });
          } else if (typeof plugin === "function") {
            this.plugins.push({ mod: plugin });
          }
        }
      }
    }
  }

  async runPlugins() {
    console.log("runPlugin", this.plugins);
  }
}

module.exports = Service;
