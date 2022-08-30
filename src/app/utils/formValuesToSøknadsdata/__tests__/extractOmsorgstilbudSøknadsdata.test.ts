import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudFormData } from '../../../types/SøknadFormValues';
import { extractOmsorgstibudSøknadsdata } from '../extractOmsorgstibudSøknadsdata';

const søknadsperiode: DateRange = {
    from: new Date(2021, 1, 1),
    to: new Date(2021, 1, 10),
};

const omsorgstilbud: OmsorgstilbudFormData = {
    erIOmsorgstilbud: YesOrNo.YES,
    enkeltdager: { '2021-02-01': { hours: '1', minutes: '0' } },
    erLiktHverUke: YesOrNo.NO,
};

describe('extractOmsorgstibudSøknadsdata', () => {
    it('returnerer erIOmsorgstilbudEnkeltDager dersom erLiktHverUke === NO,', () => {
        const result = extractOmsorgstibudSøknadsdata(søknadsperiode, omsorgstilbud);
        expect(result).toBeDefined();
        expect(result?.type).toEqual('erIOmsorgstilbudEnkeltDager');
    });

    it('returnerer erIOmsorgstilbudFasteDager dersom erLiktHverUke === NO,', () => {
        const result = extractOmsorgstibudSøknadsdata(søknadsperiode, {
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
        const result = extractOmsorgstibudSøknadsdata(søknadsperiode, {
            ...omsorgstilbud,
            erIOmsorgstilbud: YesOrNo.NO,
        });
        expect(result).toBeUndefined();
    });

    it('returnerer undefined dersom omsorgstilbud er undefined', () => {
        const result = extractOmsorgstibudSøknadsdata(søknadsperiode, undefined);
        expect(result).toBeUndefined();
    });
});
