# ------------------------------------------------
# Install all npm dependencies for web
FROM node:alpine as builderWeb
WORKDIR /tmp/web
COPY package.json .
RUN npm install

# ------------------------------------------------
FROM node:alpine as startHeroku
WORKDIR /usr/src/heroku
COPY server.js .
COPY --from=builderWeb /tmp/web/. ./

COPY ts*.json ./
COPY .babelrc .
COPY .env .
COPY postcss.config.js .
COPY heroku ./heroku
COPY src/build/scripts/decorator.js ./src/build/scripts/decorator.js
COPY src/build/scripts/envSettings.js ./src/build/scripts/envSettings.js
COPY src/build/scripts/heroku-build.js ./src/build/scripts/heroku-build.js

COPY src/build/webpack/webpack.config.global.js ./src/build/webpack/webpack.config.global.js
COPY src/build/webpack/webpack.config.heroku.js ./src/build/webpack/webpack.config.heroku.js

COPY src/app ./src/app

# RUN ls -la node_modules
RUN npm run build-heroku

EXPOSE 8080
CMD ["npm", "run", "start-express"]
# ------------------------------------------------

FROM node:alpine as startDevNoDecorator
WORKDIR /usr/src/dev
COPY --from=builderWeb /tmp/web/. ./

COPY ts*.json ./
COPY .babelrc .
COPY .env .
COPY postcss.config.js .

COPY src/build/webpack/webpack.config.global.js ./src/build/webpack/webpack.config.global.js
COPY src/build/webpack/devserver.config.js ./src/build/webpack/devserver.config.js
COPY src/build/webpack/webpack.config.dev.js ./src/build/webpack/webpack.config.dev.js
COPY src/build/scripts/decorator.js ./src/build/scripts/decorator.js
COPY src/build/scripts/envSettings.js ./src/build/scripts/envSettings.js

COPY src/app ./src/app

EXPOSE 8080
CMD ["npm", "run", "start-no-decorator"]
# ------------------------------------------------

FROM node:alpine as builderApiMock
WORKDIR /tmp/mock
RUN npm init --yes
RUN npm add busboy express
RUN npm install

# ------------------------------------------------
FROM node:alpine as startApiMock
WORKDIR /usr/src/mock
COPY api-mock.js .
COPY --from=builderApiMock /tmp/mock/. ./
EXPOSE 8082
CMD ["node", "./api-mock.js"]