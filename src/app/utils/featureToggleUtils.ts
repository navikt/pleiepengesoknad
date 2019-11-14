export enum Feature {
    'TOGGLE_FJERN_GRAD' = 'TOGGLE_FJERN_GRAD',
    'TOGGLE_TILSYN' = 'TOGGLE_TILSYN',
    'DEMO_MODE' = 'DEMO_MODE',
    'UTILGJENGELIG' = 'UTILGJENGELIG'
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
