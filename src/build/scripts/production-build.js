const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack.config.production');

require('dotenv').config();

webpackConfig.output.publicPath = `${process.env.PUBLIC_PATH}/dist`;
console.log('production-build.js: publicPath', process.env.PUBLIC_PATH);

webpack(webpackConfig, (err, stats) => {
    if (err || (stats.compilation.errors && stats.compilation.errors.length > 0)) {
        let error = err || stats.compilation.errors;
        console.error(error);
        process.exit(1);
    }
});
