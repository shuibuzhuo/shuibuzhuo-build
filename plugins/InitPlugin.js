const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = function (api, options) {
  const { getWebpackConfig } = api;
  const config = getWebpackConfig();
  const dir = process.cwd();

  const mode = process.env.ZHUO_BUILD_MODE || "development";
  config.mode(mode);

  config.entry("index").add(path.resolve(dir, "./src/index.js"));

  config.output.filename("js/[name]/js").path(path.resolve(dir, "./dist"));

  config.module
    .rule("css")
    .test(/\.css$/)
    .exclude.add(/node_modules/)
    .end()
    .use("mini-css")
    .loader(MiniCssExtractPlugin.loader)
    .end()
    .use("css-loader")
    .loader("css-loader");

  config.module
    .rule("asset")
    .test(/\.(png|svg|jpg|jpeg|gif)$/i)
    .type("asset")
    .parser({
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    });

  config.module
    .rule("asset")
    .set("generator", { filename: "images/[name].[hash:6][ext]" });

  config.module
    .rule("ejs")
    .test(/\.ejs$/)
    .exclude.add(/node_modules/)
    .end()
    .use("ejs-loader")
    .loader("ejs-loader")
    .options({
      esModule: false,
    });

  config.plugin("MiniCssExtractPlugin").use(MiniCSSExtractPlugin, [
    {
      filename: "css/[name].css",
      chunkFilename: "css/[name].chunk.css",
    },
  ]);

  config.plugin("HtmlWebpackPlugin").use(HtmlWebpackPlugin, [
    {
      filename: "index.html",
      template: path.resolve(dir, "./public/index.html"),
      chunks: ["index"],
    },
  ]);

  config.plugin("ProvidePlugin").use(webpack.DefinePlugin, [
    {
      $: "jquery",
      jQuery: "jquery",
    },
  ]);

  config.plugin("CopyPlugin").use(CopyWebpackPlugin, [
    {
      patterns: [
        {
          from: path.resolve(dir, "./src/img"),
          to: path.resolve(dir, "./dist/img"),
        },
      ],
    },
  ]);

  config.plugin("CleanPlugin").use(CleanWebpackPlugin, []);

  config.optimization.minimize(true).splitChunks({
    minSize: 30 * 1024,
    chunks: "all",
    name: "common",
    cacheGroups: {
      jquery: {
        name: "jquery",
        test: /jquery\.js/,
        chunks: "all",
      },
      "lodash-es": {
        name: "lodash-es",
        test: /lodash-es/,
        chunks: "all",
      },
    },
  });
};
