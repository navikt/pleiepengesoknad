export enum Feature {
    'TOGGLE_FJERN_GRAD' = 'TOGGLE_FJERN_GRAD',
    'TOGGLE_TILSYN' = 'TOGGLE_TILSYN',
    'DEMO_MODE' = 'DEMO_MODE'
}

export const isFeatureEnabled = (feature: Feature) =>
    (window as any).appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
