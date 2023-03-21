const { defineConfig } = require('cypress');

module.exports = defineConfig({
    testIsolation: 'legacy',
    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
            return require('./e2e/cypress/plugins/index.js')(on, config);
        },
    },
});
