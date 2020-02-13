# ------------------------------------------------
# Install all npm dependencies for web
FROM node:alpine as builderWeb
WORKDIR /tmp/web
COPY package.json .
COPY package-lock.json .
RUN npm install

# ------------------------------------------------

FROM node:alpine as startDevNoDecorator
WORKDIR /usr/src/dev
COPY --from=builderWeb /tmp/web/. ./

COPY .babelrc .
COPY .env .
COPY postcss.config.js .
COPY ts*.json ./
COPY src ./src

RUN ls -la
RUN ls -la src
EXPOSE 8080
CMD ["npm", "run", "start-no-decorator"]
