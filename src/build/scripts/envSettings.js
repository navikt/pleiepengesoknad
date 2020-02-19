const fsExtra = require('fs-extra');

function createEnvSettingsFile(settingsFile) {
    fsExtra.ensureFile(settingsFile).then((f) => {
        fsExtra.writeFileSync(
            settingsFile,
            `window.appSettings = {
                API_URL: '${process.env.API_URL}',
                LOGIN_URL: '${process.env.LOGIN_URL}',
                PUBLIC_PATH: '${process.env.PUBLIC_PATH}',
                DEMO_MODE: '${process.env.DEMO_MODE}',
                UTILGJENGELIG: '${process.env.UTILGJENGELIG}',
                TOGGLE_BOSTED_UTLAND: '${process.env.TOGGLE_BOSTED_UTLAND}',
                TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN: '${process.env.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN}',
                TOGGLE_FERIEUTTAK: '${process.env.TOGGLE_FERIEUTTAK}',
                TOGGLE_FRILANS: '${process.env.TOGGLE_FRILANS}',
                TOGGLE_SELVSTENDIG: '${process.env.TOGGLE_SELVSTENDIG}'
            };`
        );
    });
}

module.exports = createEnvSettingsFile;
