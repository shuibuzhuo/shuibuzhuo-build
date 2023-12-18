const path = require("path");
const fs = require("fs");
const fg = require("fast-glob");

const DEFAULT_CONFIG_FILE = "shuibuzhuo-config.(mjs|js|json)";

function getConfigFile({ cwd = process.cwd() } = {}) {
  const [configFile] = fg.sync(DEFAULT_CONFIG_FILE, {
    cwd,
    absolute: true,
  });

  return configFile;
}

async function loadModule(modulePath) {
  let fnPath;
  // 判断 modulePath 是一个模块还是一个路径
  if (modulePath.startsWith(".") || modulePath.startsWith("/")) {
    fnPath = path.isAbsolute(modulePath)
      ? modulePath
      : path.resolve(modulePath);
  } else {
    fnPath = modulePath;
  }

  fnPath = require.resolve(fnPath, {
    paths: [path.resolve(process.cwd(), "node_modules")],
  });

  if (fs.existsSync(fnPath)) {
    let result;
    const isMjs = fnPath.endsWith("mjs");

    if (isMjs) {
      result = (await import(fnPath)).default;
    } else {
      result = require(fnPath);
    }

    return result;
  }

  return null;
}

module.exports = {
  getConfigFile,
  loadModule,
};
