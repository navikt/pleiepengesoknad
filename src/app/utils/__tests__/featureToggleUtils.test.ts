import { Feature, isFeatureEnabled } from '../featureToggleUtils';

describe('featureToggleUtils', () => {
    describe('isFeatureEnabled', () => {
        it('it should return true if the specified feature is enabled', () => {
            (window as any).appSettings = { HENT_BARN_FEATURE: 'on' };
            expect(isFeatureEnabled(Feature.HENT_BARN_FEATURE)).toBe(true);
            (window as any).appSettings = { HENT_BARN_FEATURE: 'true' };
            expect(isFeatureEnabled(Feature.HENT_BARN_FEATURE)).toBe(true);
        });

        it('should return false if specified feature is set to neither "on" nor "true"', () => {
            (window as any).appSettings = { HENT_BARN_FEATURE: undefined };
            expect(isFeatureEnabled(Feature.HENT_BARN_FEATURE)).toBe(false);
            (window as any).appSettings = { HENT_BARN_FEATURE: 'off' };
            expect(isFeatureEnabled(Feature.HENT_BARN_FEATURE)).toBe(false);
            (window as any).appSettings = { HENT_BARN_FEATURE: 'false' };
            expect(isFeatureEnabled(Feature.HENT_BARN_FEATURE)).toBe(false);
        });
    });
});
