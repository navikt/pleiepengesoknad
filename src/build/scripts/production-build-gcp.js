const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack.config.production');
webpackConfig.output.publicPath = '/familie/sykdom-i-familien/soknad/pleiepenger';

return webpack(webpackConfig, (err, stats) => {
    if (err || (stats.compilation.errors && stats.compilation.errors.length > 0)) {
        let error = err || stats.compilation.errors;
        console.error(error);
        process.exit(1);
    }
});
