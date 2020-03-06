FROM node:alpine

WORKDIR /usr/src/app
COPY api-mock.js .
COPY package.json .
COPY package-lock.json .
RUN npm ci

EXPOSE 8082
CMD ["npm", "run", "start-api-mock"]
