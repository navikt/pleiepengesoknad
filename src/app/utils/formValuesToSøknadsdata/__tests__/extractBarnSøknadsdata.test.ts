import { extractBarnSøknadsdata } from '../extractBarnSøknadsdata';
import { OmBarnetFormData } from '../../../types/SøknadFormValues';
import { BarnRelasjon, ÅrsakManglerIdentitetsnummer } from '../../../types';

const formData: OmBarnetFormData = {
    barnetsNavn: '',
    barnetsFødselsnummer: '',
    barnetSøknadenGjelder: '1',
    barnetHarIkkeFnr: false,
};

describe('extractBarnetSøknadsdata', () => {
    describe('Barn fra Api', () => {
        it('returnerer registrerteBarn dersom bruker valgte registrerete barnet', () => {
            const result = extractBarnSøknadsdata(formData);
            expect(result).toBeDefined();
            expect(result?.type).toEqual('registrerteBarn');
        });
    });

    describe('Annet Barn med fnr', () => {
        it('returnerer annetBarn dersom bruker la til barn med fnr', () => {
            const result = extractBarnSøknadsdata({
                ...formData,
                barnetSøknadenGjelder: '',
                barnetsNavn: 'Test Testen',
                barnetsFødselsnummer: '12345678911',
                relasjonTilBarnet: BarnRelasjon.FAR,
            });
            expect(result).toBeDefined();
            expect(result?.type).toEqual('annetBarn');
        });
    });

    describe('Annet Barn uten fnr', () => {
        it('returnerer annetBarnUtenFnr dersom bruker la til barn uten fnr', () => {
            const result = extractBarnSøknadsdata({
                ...formData,
                barnetSøknadenGjelder: '',
                barnetsNavn: 'Test Testen',
                barnetHarIkkeFnr: true,
                barnetsFødselsnummer: '',
                barnetsFødselsdato: '2020.12.12',
                årsakManglerIdentitetsnummer: ÅrsakManglerIdentitetsnummer.BARNET_BOR_I_UTLANDET,
                relasjonTilBarnet: BarnRelasjon.FAR,
            });
            expect(result).toBeDefined();
            expect(result?.type).toEqual('annetBarnUtenFnr');
        });
    });

    describe('Tomt barnet i søknadsdata', () => {
        it('returnerer undefined med tomt barnet', () => {
            const result = extractBarnSøknadsdata({
                ...formData,
                barnetSøknadenGjelder: '',
                barnetsNavn: 'Test Testen',
                barnetHarIkkeFnr: true,
                barnetsFødselsnummer: '',
                barnetsFødselsdato: '',
                årsakManglerIdentitetsnummer: undefined,
                relasjonTilBarnet: BarnRelasjon.FAR,
            });

            expect(result).toBeUndefined();
        });
    });
});
