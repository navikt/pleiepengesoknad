const webpackConfig = require('./webpack.config.global.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

webpackConfig.mode = 'production';
webpackConfig.devtool = 'source-map';

webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
        template: `${__dirname}/../../app/index.html`,
        inject: 'body',
        hash: true,
    })
);

module.exports = webpackConfig;
