const process = require('process');
require('dotenv').config();

const envSettings = () => {
    const appSettings = `
    window.appSettings = {
        API_URL: '${process.env.API_URL}',
        API_URL_INNSYN: '${process.env.API_URL_INNSYN}',
        LOGIN_URL: '${process.env.LOGIN_URL}',
        PUBLIC_PATH: '${process.env.PUBLIC_PATH}',
        UTILGJENGELIG: '${process.env.UTILGJENGELIG}',
        NYNORSK: '${process.env.NYNORSK}',
        INNSYN: '${process.env.INNSYN}',
        APPSTATUS_PROJECT_ID: '${process.env.APPSTATUS_PROJECT_ID}',
        APPSTATUS_DATASET: '${process.env.APPSTATUS_DATASET}',
        USE_AMPLITUDE: '${process.env.USE_AMPLITUDE}',
        APP_VERSION: '${process.env.APP_VERSION}',
        INNSYN_URL: '${process.env.INNSYN_URL}',
        FORENKLET_ARBEID: '${process.env.FORENKLET_ARBEID}',
        PREUTFYLLING: '${process.env.PREUTFYLLING}',
        DEMO_MODE: '${process.env.DEMO_MODE}',
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
