import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudFormValues } from '../../../types/SøknadFormValues';
import { extractOmsorgstibudSøknadsdata } from '../extractOmsorgstibudSøknadsdata';

const omsorgstilbud: OmsorgstilbudFormValues = {
    erIOmsorgstilbudFortid: YesOrNo.YES,
    enkeltdager: { '2021-02-01': { hours: '1', minutes: '0' } },
    erLiktHverUke: YesOrNo.NO,
};

describe('extractOmsorgstibudSøknadsdata', () => {
    it('returnerer erIOmsorgstilbudEnkeltDager dersom erLiktHverUke === NO,', () => {
        const result = extractOmsorgstibudSøknadsdata(omsorgstilbud);
        expect(result).toBeDefined();
        expect(result?.type).toEqual('erIOmsorgstilbudEnkeltDager');
    });

    it('returnerer erIOmsorgstilbudFasteDager dersom erLiktHverUke === NO,', () => {
        const result = extractOmsorgstibudSøknadsdata({
            ...omsorgstilbud,
            fasteDager: {
                friday: { hours: '1', minutes: '0' },
            },
            enkeltdager: undefined,
            erLiktHverUke: YesOrNo.YES,
        });
        expect(result).toBeDefined();
        expect(result?.type).toEqual('erIOmsorgstilbudFasteDager');
    });

    it('returnerer undefined dersom erIOmsorgstilbud === NO', () => {
        const result = extractOmsorgstibudSøknadsdata({
            ...omsorgstilbud,
            erIOmsorgstilbudFortid: YesOrNo.NO,
        });
        expect(result).toBeUndefined();
    });

    it('returnerer undefined dersom omsorgstilbud er undefined', () => {
        const result = extractOmsorgstibudSøknadsdata(undefined);
        expect(result).toBeUndefined();
    });
});
