export enum Feature {
    'UTILGJENGELIG' = 'UTILGJENGELIG',
    'TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN' = 'TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN',
    'TOGGLE_FERIEUTTAK' = 'TOGGLE_FERIEUTTAK',
    'TOGGLE_FRILANS' = 'TOGGLE_FRILANS',
    'TOGGLE_SELVSTENDIG' = 'TOGGLE_SELVSTENDIG',
    'TOGGLE_8_UKER' = 'TOGGLE_8_UKER',
    'TOGGLE_BEKREFT_OMSORG' = 'TOGGLE_BEKREFT_OMSORG',
    'UTVIDET_KVITTERING' = 'UTVIDET_KVITTERING',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
