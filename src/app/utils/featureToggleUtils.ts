export enum Feature {
    'UTILGJENGELIG' = 'UTILGJENGELIG',
    'NYNORSK' = 'NYNORSK',
    'INNSYN' = 'INNSYN',
    'TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN' = 'TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN',
    'TOGGLE_8_UKER' = 'TOGGLE_8_UKER',
    'TOGGLE_BEKREFT_OMSORG' = 'TOGGLE_BEKREFT_OMSORG',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
