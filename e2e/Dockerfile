FROM cypress/included:12.11.0
WORKDIR /usr/src/app
COPY . .
RUN CYPRESS_INSTALL_BINARY=0 npm ci
CMD ["npx", "run", "cypress"]