import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { extractBeredskapSøknadsdata } from '../extractBeredskapSøknadsdata';

// Beredskap
describe('extractBeredskapSøknadsdata', () => {
    it('returnerer type harBeredskap og harBeredskap === true', () => {
        const result = extractBeredskapSøknadsdata({
            omsorgstilbud: { erIOmsorgstilbudFremtid: YesOrNo.YES },
            harBeredskap: YesOrNo.YES,
            harBeredskap_ekstrainfo: 'Tekst',
        });
        expect(result).toBeDefined();
        expect(result?.harBeredskap).toEqual(true);
        expect(result?.type).toEqual('harBeredskap');
    });

    it('returnerer type harIkkeBeredskap og harBeredskap === false', () => {
        const result = extractBeredskapSøknadsdata({
            omsorgstilbud: { erIOmsorgstilbudFremtid: YesOrNo.YES },
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
            omsorgstilbud: { erIOmsorgstilbudFremtid: YesOrNo.NO, erIOmsorgstilbudFortid: YesOrNo.NO },
            harBeredskap: YesOrNo.YES,
            harBeredskap_ekstrainfo: 'Tekst',
        });
        expect(result).toBeUndefined();
    });
});
