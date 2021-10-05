import { søkerHarValgtRegistrertBarn } from '../tidsromUtils';

jest.mock('../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {},
}));

describe('søkerHarValgtRegistrertBarn', () => {
    it('should return false if only fødselsnummer is registered', () => {
        expect(søkerHarValgtRegistrertBarn({ barnetsFødselsnummer: '123' })).toBeFalsy();
    });
    it('should return true if barnetSøknadenGjelder is checked', () => {
        expect(søkerHarValgtRegistrertBarn({ barnetSøknadenGjelder: '123' })).toBeTruthy();
    });
});
