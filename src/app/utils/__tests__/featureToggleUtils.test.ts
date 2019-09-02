import { Feature, isFeatureEnabled } from '../featureToggleUtils';

describe('featureToggleUtils', () => {
    describe('isFeatureEnabled', () => {
        it('it should return true if the specified feature is enabled', () => {
            (window as any).appSettings = { TOGGLE_FJERN_GRAD: 'on' };
            expect(isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD)).toBe(true);
            (window as any).appSettings = { TOGGLE_FJERN_GRAD: 'true' };
            expect(isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD)).toBe(true);
        });

        it('should return false if specified feature is set to neither "on" nor "true"', () => {
            (window as any).appSettings = { TOGGLE_FJERN_GRAD: undefined };
            expect(isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD)).toBe(false);
            (window as any).appSettings = { TOGGLE_FJERN_GRAD: 'off' };
            expect(isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD)).toBe(false);
            (window as any).appSettings = { TOGGLE_FJERN_GRAD: 'false' };
            expect(isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD)).toBe(false);
        });
    });
});
