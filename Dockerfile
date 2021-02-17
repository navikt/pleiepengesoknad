FROM node:14

WORKDIR /usr/src/app

COPY dist ./dist
COPY server.js .
COPY node_modules ./node_modules
COPY package.json .
COPY src/build/scripts/decorator.js ./src/build/scripts/decorator.js
COPY src/build/scripts/envSettings.js ./src/build/scripts/envSettings.js
ENV PUBLIC_PATH '/familie/sykdom-i-familien/soknad/pleiepengesoknad'
EXPOSE 8080
CMD ["npm", "run", "start-express"]
