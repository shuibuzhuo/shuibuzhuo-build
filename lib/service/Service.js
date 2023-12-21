const path = require("path");
const fs = require("fs");
const log = require("../utils/log");
const WebpackChain = require("webpack-chain");
const { getConfigFile, loadModule } = require("../utils");
const constant = require("./const");
const InitPlugin = require("../../plugins/InitPlugin");

const HOOK_KEYS = [constant.HOOK_START, constant.HOOK_PLUGIN];

class Service {
  constructor(opts) {
    log.verbose("Service constructor opts", opts);
    this.args = opts;
    this.config = {};
    this.hooks = {};
    this.plugins = [];
    this.dir = process.cwd();
    this.webpackConfig = null;
    this.internalValue = {};
    this.webpack = null;
  }

  start = async () => {
    await this.resolveConfig();
    await this.registerHooks();
    await this.emitHooks(constant.HOOK_START);
    await this.registerPlugins();
    await this.runPlugins();
    await this.initWebpack();
    await this.startServer();
  };

  startServer = async() => {
    let compiler

    try {
      const webpack = require(this.webpack)
      const webpackConfig = this.webpackConfig.toConfig()
      log.verbose('webpackConfig', webpackConfig)
      compiler = webpack(webpackConfig, (err, stats) => {
        if (err) {
          log.error('ERROR!', err)
        } else {
          const res = stats.toJson({ all: false, errors: true, warnings: true, timings: true })
          if (res.errors && res.errors.length > 0) {
            log.error('COMPILE ERROR!')
            res.errors.forEach(error => {
              log.error('ERROR MESSAGE', error.message)
            })
          } else if (res.warnings && res.warnings.length > 0) {
            log.warn('COMPILE WARNING!')
            res.warnings.forEach(warning => {
              log.warn('WARNING MESSAGE', warning.message)
            })
          } else {
            log.info('COMPILE SUCCESSFULLY', 'Compile finish in ' + res.time / 1000 + 's')
          }
        }
      })
    } catch (error) {
      log.error('error', error)
    }

    compiler.hooks.done.tap('compileHook', () => {
      console.log('done!');
    })
  }

  initWebpack = () => {
    const { customWebpackPath } = this.args;
    if (customWebpackPath) {
      if (fs.existsSync(customWebpackPath)) {
        let p = customWebpackPath;
        if (!path.isAbsolute(p)) {
          const res1 = path.resolve(p);
          console.log("res1", res1);
          p = res1;
        }
        const res2 = require.resolve(p, {
          paths: [path.resolve(process.cwd(), "node_modules")],
        });
        console.log("res2", res2);
        this.webpack = res2;
      }
    } else {
      this.webpack = require.resolve("webpack", {
        paths: [path.resolve(process.cwd(), "node_modules")],
      });
    }

    log.verbose("webpack path", this.webpack);
  };

  resolveConfig = async () => {
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

    this.webpackConfig = new WebpackChain();
  };

  registerHooks = async () => {
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
  };

  emitHooks = async (key) => {
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
  };

  registerPlugins = async () => {
    let { plugins } = this.config;
    const builtInPlugins = [InitPlugin];
    builtInPlugins.forEach((plugin) => {
      this.plugins.push({
        mod: plugin,
      });
    });
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
  };

  runPlugins = async () => {
    for (const plugin of this.plugins) {
      const { mod, params } = plugin;

      if (!mod) continue;

      const API = {
        getWebpackConfig: this.getWebpackConfig,
        emitHooks: this.emitHooks,
        setValue: this.setValue,
        getValue: this.getValue,
        log,
      };

      const options = {
        ...params,
      };

      await mod(API, options);
    }
  };

  getWebpackConfig = () => {
    return this.webpackConfig;
  };

  setValue = (key, value) => {
    this.internalValue[key] = value;
  };

  getValue = (key) => {
    return this.internalValue[key];
  };
}

module.exports = Service;
