const fsExtra = require('fs-extra');
const envSettings = require('../../../envSettings');

// Used by ~/server.js, ~/src/build/scripts/start-dev.js and start-dev-no-decorator.js
const createEnvSettingsFile = async (settingsFile) => {
    try {
        await fsExtra.ensureFile(settingsFile);
        fsExtra.writeFileSync(settingsFile, `${envSettings()}`); // => dist/js/settings.js, and used by dist/dev/index.html
    } catch (e) {
        console.error(e);
    }
};

module.exports = createEnvSettingsFile;
