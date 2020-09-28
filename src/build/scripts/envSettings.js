const process = require('process');
const fsExtra = require('fs-extra');

// Used by ~/server.js, ~/src/build/scripts/start-dev.js and start-dev-no-decorator.js
const createEnvSettingsFile = async (settingsFile) => {
    // See .env, nais/dev-sbs.yml and nais/prod-sbs.yml
    const API_URL = process.env.API_URL;
    const LOGIN_URL = process.env.LOGIN_URL;
    const PUBLIC_PATH = process.env.PUBLIC_PATH;
    const UTILGJENGELIG = process.env.UTILGJENGELIG;
    const NYNORSK = process.env.NYNORSK;
    const TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN = process.env.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN;
    const TOGGLE_8_UKER = process.env.TOGGLE_8_UKER;
    const APPSTATUS_PROJECT_ID = process.env.APPSTATUS_PROJECT_ID;
    const APPSTATUS_DATASET = process.env.APPSTATUS_DATASET;

    const appSettings = `
    window.appSettings = {
        API_URL: '${API_URL}',
        LOGIN_URL: '${LOGIN_URL}',
        PUBLIC_PATH: '${PUBLIC_PATH}',
        UTILGJENGELIG: '${UTILGJENGELIG}',
        NYNORSK: '${NYNORSK}',
        TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN: '${TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN}',
        TOGGLE_8_UKER: '${TOGGLE_8_UKER}',
        TOGGLE_BEKREFT_OMSORG: '${process.env.TOGGLE_BEKREFT_OMSORG}',
        APPSTATUS_PROJECT_ID: '${APPSTATUS_PROJECT_ID}',
        APPSTATUS_DATASET: '${APPSTATUS_DATASET}',
    };`
        .trim()
        .replace(/ /g, '');

    try {
        await fsExtra.ensureFile(settingsFile);
        fsExtra.writeFileSync(settingsFile, `${appSettings}`); // => dist/js/settings.js, and used by dist/dev/index.html
    } catch (e) {
        console.error(e);
    }
};

module.exports = createEnvSettingsFile;
