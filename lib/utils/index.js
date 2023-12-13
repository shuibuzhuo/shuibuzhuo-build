const fg = require("fast-glob");

const DEFAULT_CONFIG_FILE = "shuibuzhuo-config.(mjs|js|json)";

function getConfigFile({ cwd = process.cwd() } = {}) {
  const [configFile] = fg.sync(DEFAULT_CONFIG_FILE, {
    cwd,
    absolute: true,
  });

  return configFile;
}

module.exports = {
  getConfigFile,
};
