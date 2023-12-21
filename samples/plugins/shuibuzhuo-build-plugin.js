const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = function (api, options) {
  const dir = process.cwd();

  api.getWebpackConfig().plugin('HtmlWebpackPlugin2').use(HtmlWebpackPlugin, [{
    filename: 'index2.html',
    template: path.resolve(dir, './public/index2.html'),
    chunks: ['index']
  }]) 
};
