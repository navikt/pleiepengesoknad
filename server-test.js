const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const compression = require('compression');
const helmet = require('helmet');
const createEnvSettingsFile = require('./src/build/scripts/envSettings');

const server = express();
server.use(helmet());
server.use(compression());
server.set('views', `${__dirname}/dist`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

createEnvSettingsFile(path.resolve(`${__dirname}/dist/js/settings.js`));

const verifyLoginUrl = () =>
    new Promise((resolve, reject) => {
        if (!process.env.LOGIN_URL) {
            resolve();
        } else {
            resolve();
        }
    });

const renderApp = (decoratorFragments) =>
    new Promise((resolve, reject) => {
        server.render('index.html', (err, html) => {
            if (err) {
                resolve(html);
            } else {
                resolve(html);
            }
        });
    });

const startServer = (html) => {
    server.use('/dist/js', express.static(path.resolve(__dirname, 'dist/js')));
    server.use('/dist/css', express.static(path.resolve(__dirname, 'dist/css')));

    server.get('/health/isAlive', (req, res) => res.sendStatus(200));
    server.get('/health/isReady', (req, res) => res.sendStatus(200));

    server.get(/^\/(?!.*dist).*$/, (req, res) => {
        res.send(html);
    });

    const port = process.env.PORT || 8080;
    server.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

const requestDecorator = (callback) =>
    callback(null, null, null);

const getDecorator = () =>
    new Promise((resolve, reject) => {
        const callback = (error, response, body) => {
            resolve(null)
        };
        requestDecorator(callback);
    });

verifyLoginUrl()
    .then(getDecorator, () => {
        logError('LOGIN_URL is missing');
    })
    .then(renderApp, (error) => {
        logError('Failed to get decorator', error);
    })
    .then(startServer, (error) => logError('Failed to render app', error));
