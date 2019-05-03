export enum Feature {
    'HENT_BARN_FEATURE' = 'HENT_BARN_FEATURE'
}

export const isFeatureEnabled = (feature: Feature) =>
    (window as any).appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
