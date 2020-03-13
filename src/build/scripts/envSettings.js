const process = require('process');
const fsExtra = require('fs-extra');

// Used by ~/server.js, ~/src/build/scripts/start-dev.js and start-dev-no-decorator.js
const createEnvSettingsFile = async (settingsFile) => {
    // See .env, nais/dev-sbs.yml and nais/prod-sbs.yml
    const API_URL = process.env.API_URL;
    const LOGIN_URL = process.env.LOGIN_URL;
    const PUBLIC_PATH = process.env.PUBLIC_PATH;
    const DEMO_MODE = process.env.DEMO_MODE;
    const UTILGJENGELIG = process.env.UTILGJENGELIG;
    const TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN = process.env.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN;
    const TOGGLE_FERIEUTTAK = process.env.TOGGLE_FERIEUTTAK;
    const TOGGLE_FRILANS = process.env.TOGGLE_FRILANS;
    const TOGGLE_SELVSTENDIG = process.env.TOGGLE_SELVSTENDIG;
    const TOGGLE_8_UKER = process.env.TOGGLE_8_UKER;

    const appSettings = `
    window.appSettings = {
        API_URL: '${API_URL}',
        LOGIN_URL: '${LOGIN_URL}',
        PUBLIC_PATH: '${PUBLIC_PATH}',
        DEMO_MODE: '${DEMO_MODE}',
        UTILGJENGELIG: '${UTILGJENGELIG}',
        TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN: '${TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN}',
        TOGGLE_FERIEUTTAK: '${TOGGLE_FERIEUTTAK}',
        TOGGLE_FRILANS: '${TOGGLE_FRILANS}',
        TOGGLE_SELVSTENDIG: '${TOGGLE_SELVSTENDIG}',
        TOGGLE_8_UKER: '${TOGGLE_8_UKER}'
    };`.trim().replace(/ /g, '');

    try {
        await fsExtra.ensureFile(settingsFile);
        fsExtra.writeFileSync(settingsFile, `${appSettings}`); // => dist/js/settings.js, and used by dist/dev/index.html
    }
    catch (e) {
        console.error(e);
    }
};

module.exports = createEnvSettingsFile;
