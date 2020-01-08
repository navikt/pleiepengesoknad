const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
    fsExtra.ensureFile(settingsFile).then((f) => {
        fsExtra.writeFileSync(
            settingsFile,
            `window.appSettings = {
                API_URL: '${process.env.API_URL}',
                LOGIN_URL: '${process.env.LOGIN_URL}',
                DEMO_MODE: '${process.env.DEMO_MODE}',
                UTILGJENGELIG: '${process.env.UTILGJENGELIG}',
                TOGGLE_UTENLANDSOPPHOLD: '${process.env.TOGGLE_UTENLANDSOPPHOLD}'
            };`
        );
    });
}

module.exports = createEnvSettingsFile;
