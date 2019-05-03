const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
    fsExtra.ensureFile(settingsFile).then((f) => {
        fsExtra.writeFileSync(
            settingsFile,
            `window.appSettings = {
                API_URL: '${process.env.API_URL}',
                LOGIN_URL: '${process.env.LOGIN_URL}',
                HENT_BARN_FEATURE: '${process.env.HENT_BARN_FEATURE}'
            };`
        );
    });
}

module.exports = createEnvSettingsFile;
