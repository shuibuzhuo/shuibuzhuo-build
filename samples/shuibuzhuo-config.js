module.exports = {
  entry: "src/index.js",
  plugins: function () {
    return [
      ["shuibuzhuo-build-test", { a: 10, b: 20 }],
      function (api, options) {
        const config = api.getWebpackConfig();
        config.module
          .rule("lint")
          .test("/.js$/")
          .exclude.add("node_modules")
          .end()
          .use("eslint")
          .loader("eslint-loader");
        console.log(
          "this is anonymous plugin config",
          JSON.stringify(config.toConfig())
        );
      },
    ];
  },
  hooks: [],
};
