export enum Feature {
    'HENT_BARN_FEATURE' = 'HENT_BARN_FEATURE',
    'TOGGLE_LANGUAGE' = 'TOGGLE_LANGUAGE',
    'TOGGLE_FJERN_GRAD' = 'TOGGLE_FJERN_GRAD'
}

export const isFeatureEnabled = (feature: Feature) =>
    (window as any).appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
