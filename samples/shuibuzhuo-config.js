module.exports = {
  entry: "src/index.js",
  plugins: function () {
    return [
      ["./plugins/shuibuzhuo-build-plugin", { a: 10, b: 20 }],
      function (api, options) {
        // const config = api.getWebpackConfig();
        // config.module
        //   .rule("lint")
        //   .test(/.js$/)
        //   .exclude.add(/node_modules/)
        //   .end()
        //   .use("eslint")
        //   .loader("eslint-loader");
        // api.log.verbose("api.getValue", api.getValue("info"));
      },
    ];
  },
  hooks: [
    [
      "plugin",
      (context) => {
        console.log("config", context.webpackConfig.toConfig());
      },
    ],
  ],
};
