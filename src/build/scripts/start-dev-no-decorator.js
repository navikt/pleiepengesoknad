const path = require('path');
const process = require('process');
const webpack = require('webpack');

const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack/webpack.config.dev');
const configureDevServer = require('../webpack/devserver.config');
const createEnvSettingsFile = require('./envSettings');

require('dotenv').config();

createEnvSettingsFile(path.resolve(`${__dirname}/../../../dist/js/settings.js`));

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, configureDevServer({}));

// localhost and 127.0.0.1 are only for outgoing connections.
// 0.0.0.0 is only used for listening (aka "bind") connections, and is a wildcard meaning "listen to all network interfaces on this machine"

//server.listen(8080, '127.0.0.1', () => {  // Used with docker-compose, and normal npm start
//server.listen(8080, '0.0.0.0', () => { // Used with docker run

const startupMessage = (port, hostname) => {
    console.log(`Started WebpackDevServer on http://${hostname}:${port}`);
};
server.listen(
    process.env.PORT || 8080,
    process.env.HOST || 'localhost',
    startupMessage(process.env.PORT || 8080, process.env.HOST || 'localhost')
);
