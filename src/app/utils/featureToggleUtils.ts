export enum Feature {
    'UTILGJENGELIG' = 'UTILGJENGELIG',
    'NYNORSK' = 'NYNORSK',
    'INNSYN' = 'INNSYN',
    'ANDRE_YTELSER' = 'ANDRE_YTELSER',
    'FORENKLET_ARBEID' = 'FORENKLET_ARBEID',
    'DEMO_MODE' = 'DEMO_MODE',
}

export const isFeatureEnabled = (feature: Feature) => {
    const appSettings = (window as any).appSettings;
    return appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
};
