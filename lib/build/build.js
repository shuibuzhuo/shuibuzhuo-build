const Service = require("../service/Service");

module.exports = async function build(opts) {
  const args = {
    customWebpackPath: opts.customWebpackPath || "",
    stopBuild: opts.stopBuild,
  };

  process.env.NODE_ENV = "production";

  const service = new Service("build", args);
  await service.build();
};
