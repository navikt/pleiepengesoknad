import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudSvar } from '../../../types/søknad-api-data/SøknadApiData';
import { extractNattevåkSøknadsdata } from '../extractNattevåkSøknadsdata';

describe('extractNattevåkSøknadsdata', () => {
    it('returnerer type harNattevåk og harNattevåk === true', () => {
        const result = extractNattevåkSøknadsdata({
            omsorgstilbud: { erIOmsorgstilbud: OmsorgstilbudSvar.FAST_OG_REGELMESSIG },
            harNattevåk: YesOrNo.YES,
            harNattevåk_ekstrainfo: 'Tekst',
        });
        expect(result).toBeDefined();
        expect(result?.harNattevåk).toEqual(true);
        expect(result?.type).toEqual('harNattevåk');
    });

    it('returnerer type harIkkeNattevåk og harNattevåk === false', () => {
        const result = extractNattevåkSøknadsdata({
            omsorgstilbud: { erIOmsorgstilbud: OmsorgstilbudSvar.FAST_OG_REGELMESSIG },
            harNattevåk: YesOrNo.NO,
        });
        expect(result).toBeDefined();
        expect(result?.type).toEqual('harIkkeNattevåk');
    });

    it('returnerer undefined hvis bruker skal ikke svare på beredskap og nattevåk med Omsorgstibud === undefined', () => {
        const result = extractNattevåkSøknadsdata({
            harNattevåk: YesOrNo.YES,
            harNattevåk_ekstrainfo: 'Tekst',
        });
        expect(result).toBeUndefined();
    });

    it('returnerer undefined hvis bruker skal ikke svare på beredskap og nattevåk med Omsorgstibud.erIOmsorgstilbud === NO', () => {
        const result = extractNattevåkSøknadsdata({
            omsorgstilbud: { erIOmsorgstilbud: OmsorgstilbudSvar.IKKE_OMSORGSTILBUD },
            harNattevåk: YesOrNo.YES,
            harNattevåk_ekstrainfo: 'Tekst',
        });
        expect(result).toBeUndefined();
    });
});
