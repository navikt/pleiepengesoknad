FROM node:alpine as builderHeroku
WORKDIR /tmp/heroku
COPY package.heroku.json package.json
RUN npm install

# ------------------------------------------------
FROM node:alpine as startHeroku
WORKDIR /usr/src/heroku
COPY server.js .
COPY --from=builderHeroku /tmp/heroku/. ./

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

