import { isFeatureEnabled } from '../featureToggleUtils';
import { brukerSkalBekrefteOmsorgForBarnet, søkerHarValgtRegistrertBarn } from '../tidsromUtils';
import { Barn } from '../../types/BarnResponse';

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

describe('omsorgForBarnet', () => {
    beforeEach(() => {
        (isFeatureEnabled as any).mockImplementation(() => true);
    });

    const barnAktørId = '123';
    const barn: Barn = {
        fornavn: 'barn',
        etternavn: 'etternavn',
        aktørId: barnAktørId,
        harSammeAdresse: true,
        fødselsdato: new Date(),
    };
    describe('brukerSkalBekrefteOmsorgForBarnet', () => {
        it('should return false if user has chosen registrered child with same address', () => {
            expect(brukerSkalBekrefteOmsorgForBarnet({ barnetSøknadenGjelder: barnAktørId }, [barn])).toBeFalsy();
        });

        it('should return true if user has chosen registrered child without same address', () => {
            expect(
                brukerSkalBekrefteOmsorgForBarnet({ barnetSøknadenGjelder: barnAktørId }, [
                    { ...barn, harSammeAdresse: false },
                ])
            ).toBeTruthy();
        });

        it('should return true if user has not chosen a registered child', () => {
            expect(brukerSkalBekrefteOmsorgForBarnet({ barnetSøknadenGjelder: undefined }, [barn])).toBeTruthy();
            expect(brukerSkalBekrefteOmsorgForBarnet({ søknadenGjelderEtAnnetBarn: true }, [barn])).toBeTruthy();
        });
    });
});
