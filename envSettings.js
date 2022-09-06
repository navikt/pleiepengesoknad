const process = require('process');
require('dotenv').config();

const envSettings = () => {
    const API_URL = process.env.API_URL;
    const API_URL_INNSYN = process.env.API_URL_INNSYN;
    const LOGIN_URL = process.env.LOGIN_URL;
    const PUBLIC_PATH = process.env.PUBLIC_PATH;
    const UTILGJENGELIG = process.env.UTILGJENGELIG;
    const NYNORSK = process.env.NYNORSK;
    const INNSYN = process.env.INNSYN;
    const TOGGLE_8_UKER = process.env.TOGGLE_8_UKER;
    const APPSTATUS_PROJECT_ID = process.env.APPSTATUS_PROJECT_ID;
    const APPSTATUS_DATASET = process.env.APPSTATUS_DATASET;
    const USE_AMPLITUDE = process.env.USE_AMPLITUDE;
    const APP_VERSION = process.env.APP_VERSION;
    const INNSYN_URL = process.env.INNSYN_URL;
    const FORENKLET_ARBEID = process.env.FORENKLET_ARBEID;

    const appSettings = `
    window.appSettings = {
        API_URL: '${API_URL}',
        API_URL_INNSYN: '${API_URL_INNSYN}',
        LOGIN_URL: '${LOGIN_URL}',
        PUBLIC_PATH: '${PUBLIC_PATH}',
        UTILGJENGELIG: '${UTILGJENGELIG}',
        NYNORSK: '${NYNORSK}',
        INNSYN: '${INNSYN}',
        TOGGLE_8_UKER: '${TOGGLE_8_UKER}',
        APPSTATUS_PROJECT_ID: '${APPSTATUS_PROJECT_ID}',
        APPSTATUS_DATASET: '${APPSTATUS_DATASET}',
        USE_AMPLITUDE: '${USE_AMPLITUDE}',
        APP_VERSION: '${APP_VERSION}',
        INNSYN_URL: '${INNSYN_URL}',
        FORENKLET_ARBEID: '${FORENKLET_ARBEID}',
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
