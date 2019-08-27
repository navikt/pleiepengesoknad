export enum Feature {
    'HENT_BARN_FEATURE' = 'HENT_BARN_FEATURE',
    'TOGGLE_LANGUAGE' = 'TOGGLE_LANGUAGE',
    'TOGGLE_GRADERT_ARBEID' = 'TOGGLE_GRADERT_ARBEID',
    'TOGGLE_ERSTATT_GRAD_MED_DAGER_BORTE' = 'TOGGLE_ERSTATT_GRAD_MED_DAGER_BORTE'
}

export const isFeatureEnabled = (feature: Feature) =>
    (window as any).appSettings[feature] === 'on' || (window as any).appSettings[feature] === 'true';
