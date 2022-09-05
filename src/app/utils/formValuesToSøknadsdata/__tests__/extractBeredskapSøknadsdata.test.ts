import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudSvar } from '../../../types/søknad-api-data/SøknadApiData';
import { extractBeredskapSøknadsdata } from '../extractBeredskapSøknadsdata';

// Beredskap
describe('extractBeredskapSøknadsdata', () => {
    it('returnerer type harBeredskap og harBeredskap === true', () => {
        const result = extractBeredskapSøknadsdata({
            omsorgstilbud: { erIOmsorgstilbud: OmsorgstilbudSvar.FAST_OG_REGELMESSIG },
            harBeredskap: YesOrNo.YES,
            harBeredskap_ekstrainfo: 'Tekst',
        });
        expect(result).toBeDefined();
        expect(result?.harBeredskap).toEqual(true);
        expect(result?.type).toEqual('harBeredskap');
    });

    it('returnerer type harIkkeBeredskap og harBeredskap === false', () => {
        const result = extractBeredskapSøknadsdata({
            omsorgstilbud: { erIOmsorgstilbud: OmsorgstilbudSvar.FAST_OG_REGELMESSIG },
            harBeredskap: YesOrNo.NO,
        });
        expect(result).toBeDefined();
        expect(result?.type).toEqual('harIkkeBeredskap');
    });

    it('returnerer undefined hvis bruker skal ikke svare på beredskap og nattevåk med Omsorgstibud === undefined', () => {
        const result = extractBeredskapSøknadsdata({
            harBeredskap: YesOrNo.YES,
            harBeredskap_ekstrainfo: 'Tekst',
        });
        expect(result).toBeUndefined();
    });

    it('returnerer undefined hvis bruker skal ikke svare på beredskap og nattevåk med Omsorgstibud.erIOmsorgstilbud === NO', () => {
        const result = extractBeredskapSøknadsdata({
            omsorgstilbud: { erIOmsorgstilbud: OmsorgstilbudSvar.IKKE_OMSORGSTILBUD },
            harBeredskap: YesOrNo.YES,
            harBeredskap_ekstrainfo: 'Tekst',
        });
        expect(result).toBeUndefined();
    });
});
