export enum Feature {
    'DEMO_MODE' = 'DEMO_MODE',
    'UTILGJENGELIG' = 'UTILGJENGELIG',
    'TOGGLE_UTENLANDSOPPHOLD' = 'TOGGLE_UTENLANDSOPPHOLD'
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    console.log(feature);
    console.log((window as any).appSettings);
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
