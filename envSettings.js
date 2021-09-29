const process = require('process');
require('dotenv').config();

const envSettings = () => {
    const API_URL = process.env.API_URL;
    const LOGIN_URL = process.env.LOGIN_URL;
    const PUBLIC_PATH = process.env.PUBLIC_PATH;
    const UTILGJENGELIG = process.env.UTILGJENGELIG;
    const NYNORSK = process.env.NYNORSK;
    const INNSYN = process.env.INNSYN;
    const TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN = process.env.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN;
    const TOGGLE_8_UKER = process.env.TOGGLE_8_UKER;
    const APPSTATUS_PROJECT_ID = process.env.APPSTATUS_PROJECT_ID;
    const APPSTATUS_DATASET = process.env.APPSTATUS_DATASET;
    const USE_AMPLITUDE = process.env.USE_AMPLITUDE;
    const APP_VERSION = process.env.APP_VERSION;

    const appSettings = `
    window.appSettings = {
        API_URL: '${API_URL}',
        LOGIN_URL: '${LOGIN_URL}',
        PUBLIC_PATH: '${PUBLIC_PATH}',
        UTILGJENGELIG: '${UTILGJENGELIG}',
        NYNORSK: '${NYNORSK}',
        INNSYN: '${INNSYN}',
        TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN: '${TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN}',
        TOGGLE_8_UKER: '${TOGGLE_8_UKER}',
        APPSTATUS_PROJECT_ID: '${APPSTATUS_PROJECT_ID}',
        APPSTATUS_DATASET: '${APPSTATUS_DATASET}',
        USE_AMPLITUDE: '${USE_AMPLITUDE}',
        APP_VERSION: '${APP_VERSION}'
    };`
        .trim()
        .replace(/ /g, '');

    try {
        return appSettings;
    } catch (e) {
        console.error(e);
    }
};

module.exports = envSettings;
