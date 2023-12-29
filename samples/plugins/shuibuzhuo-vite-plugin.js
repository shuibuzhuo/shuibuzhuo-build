const path = require("path");
const { createServer, build, preview } = require("vite");

module.exports = async function () {
  const server = await createServer({
    configFile: "./vite.config.js",
  });
  await server.listen();

  server.printUrls();

  // await build({
  //   root: "./public",
  // });

  // const previewServer = await preview({
  //   // any valid user config options, plus `mode` and `configFile`
  //   preview: {
  //     port: 8080,
  //     open: true,
  //   },
  // });

  // previewServer.printUrls();
};
