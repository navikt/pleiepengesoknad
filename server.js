const express = require('express');
const mustacheExpress = require('mustache-express');
const compression = require('compression');
const getDecorator = require('./src/build/scripts/decorator');
const envSettings = require('./envSettings');
const cookieParser = require('cookie-parser');
const { initTokenX, exchangeToken } = require('./tokenx');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Promise = require('promise');
const helmet = require('helmet');
const path = require('path');
const jose = require('jose');
const { v4: uuidv4 } = require('uuid');

const server = express();

server.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);
server.use((req, res, next) => {
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
    next();
});
server.use(compression());
server.use(cookieParser());

server.set('views', path.resolve(`${__dirname}/dist`));
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const verifyLoginUrl = () =>
    new Promise((resolve, reject) => {
        if (!process.env.LOGIN_URL) {
            reject();
        } else {
            resolve();
        }
    });

const renderApp = (decoratorFragments) =>
    new Promise((resolve, reject) => {
        server.render('index.html', decoratorFragments, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

const isExpiredOrNotAuthorized = (token) => {
    if (token) {
        try {
            const exp = jose.decodeJwt(token).exp;
            return Date.now() >= exp * 1000;
        } catch (err) {
            console.error('Feilet med dekoding av token: ', err);
            return true;
        }
    }
    return true;
};

const getRouterConfig = async (req, audienceInnsyn) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    const cookie = req.cookies['selvbetjening-idtoken'];

    if (isExpiredOrNotAuthorized(token ? token : cookie)) {
        return undefined;
    }
    const exchangedToken = (await exchangeToken(token || cookie, audienceInnsyn)) || {};

    if (exchangedToken.expired() || !exchangedToken.access_token) {
        return undefined;
    }

    req.headers['authorization'] = `Bearer ${exchangedToken.access_token}`;
};

const startServer = async (html) => {
    await Promise.all([initTokenX()]);

    server.use(`${process.env.PUBLIC_PATH}/dist/js`, express.static(path.resolve(__dirname, 'dist/js')));
    server.use(`${process.env.PUBLIC_PATH}/dist/css`, (req, res, next) => {
        const requestReferer = req.headers.referer;
        if (requestReferer !== undefined && requestReferer === 'https://nav.psplugin.com/') {
            res.set('cross-origin-resource-policy', 'cross-origin');
        }
        next();
    });
    server.use(`${process.env.PUBLIC_PATH}/dist/css`, express.static(path.resolve(__dirname, 'dist/css')));
    server.get(`${process.env.PUBLIC_PATH}/health/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`${process.env.PUBLIC_PATH}/health/isReady`, (req, res) => res.sendStatus(200));
    server.get(`${process.env.PUBLIC_PATH}/dist/settings.js`, (req, res) => {
        res.set('content-type', 'application/javascript');
        res.send(`${envSettings()}`);
    });

    server.use(
        process.env.FRONTEND_API_PATH,
        createProxyMiddleware({
            target: process.env.API_URL,
            changeOrigin: true,
            pathRewrite: (path) => {
                return path.replace(process.env.FRONTEND_API_PATH, '');
            },
            router: async (req) => getRouterConfig(req, false),
            secure: true,
            xfwd: true,
            logLevel: 'info',
        })
    );

    server.use(
        process.env.FRONTEND_INNSYN_API_PATH,
        createProxyMiddleware({
            target: process.env.API_URL_INNSYN,
            changeOrigin: true,
            pathRewrite: (path) => {
                return path.replace(process.env.FRONTEND_INNSYN_API_PATH, '');
            },
            router: async (req) => getRouterConfig(req, true),
            secure: true,
            xfwd: true,
            logLevel: 'info',
        })
    );

    server.get(/^\/(?!.*api)(?!.*innsynapi)(?!.*dist).*$/, (req, res) => {
        res.send(html);
    });

    const port = process.env.PORT || 8080;

    server.listen(port, () => {
        console.log(`App listening on port: ${port}`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

verifyLoginUrl()
    .then(getDecorator, () => {
        logError('LOGIN_URL is missing');
        process.exit(1);
    })
    .then(renderApp, (error) => {
        logError('Failed to get decorator', error);
        process.exit(1);
    })
    .then(startServer, (error) => logError('Failed to render app', error));
