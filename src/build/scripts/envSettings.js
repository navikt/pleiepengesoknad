const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
    fsExtra.ensureFile(settingsFile).then((f) => {
        fsExtra.writeFileSync(
            settingsFile,
            `window.appSettings = {
                API_URL: '${process.env.API_URL}',
                LOGIN_URL: '${process.env.LOGIN_URL}',
                HENT_BARN_FEATURE: '${process.env.HENT_BARN_FEATURE}',
                TOGGLE_LANGUAGE: '${process.env.TOGGLE_LANGUAGE}',
                TOGGLE_FJERN_GRAD: '${process.env.TOGGLE_FJERN_GRAD}',
            };`
        );
    });
}

module.exports = createEnvSettingsFile;
