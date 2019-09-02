export enum Feature {
    'TOGGLE_FJERN_GRAD' = 'TOGGLE_FJERN_GRAD'
}

export const isFeatureEnabled = (feature: Feature) =>
    (window as any).appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
