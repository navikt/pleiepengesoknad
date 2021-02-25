const process = require('process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack/webpack.config.dev');
const configureDevServer = require('../webpack/devserver.config');
const getDecorator = require('./decorator');
const path = require('path');
const createEnvSettingsFile = require('./envSettings');

createEnvSettingsFile(path.resolve(`${__dirname}/../../../dist/js/settings.js`));

getDecorator().then((decoratorData) => {
    webpackConfig.output.publicPath = `${process.env.PUBLIC_PATH}/dist`;

    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, configureDevServer(decoratorData));

    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 8080;
    server.listen(port, host, () => console.log(`Started WebpackDevServer on http://${host}:${port}`));
});
