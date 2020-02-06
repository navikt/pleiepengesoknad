export enum Feature {
    'DEMO_MODE' = 'DEMO_MODE',
    'UTILGJENGELIG' = 'UTILGJENGELIG',
    'TOGGLE_UTENLANDSOPPHOLD' = 'TOGGLE_UTENLANDSOPPHOLD',
    'TOGGLE_FERIEUTTAK' = 'TOGGLE_FERIEUTTAK',
    'TOGGLE_FRILANS' = 'TOGGLE_FRILANS'
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
