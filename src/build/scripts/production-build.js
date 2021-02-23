const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack.config.production');

require('dotenv').config();

const publicPath = process.env.PUBLIC_PATH || '';
webpackConfig.output.publicPath = `${publicPath}/dist`;
console.log('production-build.js: publicPath', publicPath);

webpack(webpackConfig, (err, stats) => {
    if (err || (stats.compilation.errors && stats.compilation.errors.length > 0)) {
        let error = err || stats.compilation.errors;
        console.error(error);
        process.exit(1);
    }
});
