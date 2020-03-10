import { BarnReceivedFromApi } from '../../types/Søkerdata';
import { isFeatureEnabled } from '../featureToggleUtils';
import { brukerSkalBekrefteOmsorgForBarnet, søkerHarValgtRegistrertBarn } from '../tidsromUtils';

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

describe('omsorgForBarnet', () => {
    beforeEach(() => {
        (isFeatureEnabled as any).mockImplementation(() => true);
    });

    const barnAktørId = '123';
    const barn: BarnReceivedFromApi = {
        fornavn: 'barn',
        etternavn: 'etternavn',
        aktoer_id: barnAktørId,
        har_samme_adresse: true,
        fodselsdato: new Date()
    };
    describe('brukerSkalBekrefteOmsorgForBarnet', () => {
        it('should return false if user has chosen registrered child with same address', () => {
            expect(brukerSkalBekrefteOmsorgForBarnet({ barnetSøknadenGjelder: barnAktørId }, [barn])).toBeFalsy();
        });

        it('should return true if user has chosen registrered child without same address', () => {
            expect(
                brukerSkalBekrefteOmsorgForBarnet({ barnetSøknadenGjelder: barnAktørId }, [
                    { ...barn, har_samme_adresse: false }
                ])
            ).toBeTruthy();
        });

        it('should return true if user has not chosen a registered child', () => {
            expect(brukerSkalBekrefteOmsorgForBarnet({ barnetSøknadenGjelder: undefined }, [barn])).toBeTruthy();
            expect(brukerSkalBekrefteOmsorgForBarnet({ søknadenGjelderEtAnnetBarn: true }, [barn])).toBeTruthy();
        });
    });
});
