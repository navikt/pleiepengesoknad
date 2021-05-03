FROM node:alpine3.11

WORKDIR /usr/src/app

COPY dist ./dist
COPY server.js .
COPY node_modules ./node_modules
COPY package.json .
COPY src/build/scripts/decorator.js ./src/build/scripts/decorator.js
COPY src/build/scripts/envSettings.js ./src/build/scripts/envSettings.js

EXPOSE 8080
CMD ["npm", "run", "start-express"]
