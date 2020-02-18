const os = require('os');
const path = require('path');
const _ = require('lodash');
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

server.listen(8080, '127.0.0.1', () => {  // Used with docker-compose, and normal npm strart
// server.listen(8080, '0.0.0.0', () => { // Used with docker run
    console.log('Started server on http://localhost:8080');
    console.log('WEBnic ipv4=', getIpAdress());
});

const platformNIC = () => {
    const interfaces = os.networkInterfaces();
    switch (process.platform) {
        case 'darwin':
            return interfaces.lo0;
        case 'linux':
            if (interfaces.ens192) return interfaces.ens192;
            if (interfaces.eno16780032) return interfaces.eno16780032;
            return interfaces.lo;
        default:
            return interfaces.Ethernet0 ? interfaces.Ethernet0 : interfaces['Wi-Fi']

    }
};
const getIpAdress = () => {
    const nic = platformNIC();
    const ipv4 = _.find(nic, item => item.family === 'IPv4');
    return ipv4.address;
};

