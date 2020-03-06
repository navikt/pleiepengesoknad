import { AppFormField, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { isFeatureEnabled } from '../featureToggleUtils';
import {
    skalSpørreApiOmBrukerMåBekrefteOmsorg, søkerHarValgtRegistrertBarn
} from '../tidsromUtils';

jest.mock('../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {}
}));

describe('søkerHarValgtRegistrertBarn', () => {
    it('should return false if only fødselsnummer is registered', () => {
        expect(søkerHarValgtRegistrertBarn({ barnetsFødselsnummer: '123' })).toBeFalsy();
    });
    it('should return true if barnetSøknadenGjelder is checked', () => {
        expect(søkerHarValgtRegistrertBarn({ barnetSøknadenGjelder: '123' })).toBeTruthy();
    });
});

describe('skalSpørreApiOmBrukerMåBekrefteOmsorg', () => {
    describe('when feature is toggled off', () => {
        beforeAll(() => {
            (isFeatureEnabled as any).mockImplementation(() => false);
        });
        it(`should return false if feature us turned off`, () => {
            expect(skalSpørreApiOmBrukerMåBekrefteOmsorg({})).toBeFalsy();
        });
    });

    describe('when feature is toggled on', () => {
        beforeAll(() => {
            (isFeatureEnabled as any).mockImplementation(() => true);
        });

        it('should return false if user has no kids', () => {
            expect(skalSpørreApiOmBrukerMåBekrefteOmsorg({})).toBeFalsy();
        });

        it(`should return false if user has checked ${AppFormField.barnetHarIkkeFåttFødselsnummerEnda}`, () => {
            const formData: Partial<PleiepengesøknadFormData> = {
                søknadenGjelderEtAnnetBarn: true,
                barnetSøknadenGjelder: '123',
                barnetHarIkkeFåttFødselsnummerEnda: true
            };
            expect(skalSpørreApiOmBrukerMåBekrefteOmsorg(formData)).toBeFalsy();
        });
    });
});
