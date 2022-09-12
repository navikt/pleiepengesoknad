import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, ISODateToDate } from '@navikt/sif-common-utils';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { cleanupOmsorgstilbudStep } from '../omsorgstilbudStepUtils';

const søknadsperiode: DateRange = {
    from: ISODateToDate('2021-06-02'),
    to: ISODateToDate('2021-06-04'),
};

const enkeldagerFormData: DateDurationMap = {
    '2021-06-01': { hours: '2', minutes: '30' }, // Outside range
    '2021-06-02': { hours: '2', minutes: '30' }, // Within range
    '2021-06-03': { hours: '2', minutes: '30' }, // Within range
    '2021-06-04': { hours: '2', minutes: '30' }, // Within range
    '2021-06-05': { hours: '2', minutes: '30' }, // Outside range
};

const formValuesTemplate: Partial<SøknadFormData> = {
    omsorgstilbud: {
        erIOmsorgstilbudFortid: YesOrNo.YES,
        erLiktHverUke: YesOrNo.NO,
        enkeltdager: enkeldagerFormData,
    },
};

const formValues = formValuesTemplate as SøknadFormData;

describe('cleanupOmsorgstilbudStep', () => {
    it('removes days outside søknadsperiode', () => {
        const result = cleanupOmsorgstilbudStep(formValues, søknadsperiode);
        const enkeltdager = result.omsorgstilbud?.enkeltdager;
        expect(enkeltdager).toBeDefined();
        if (enkeltdager) {
            expect(Object.keys(enkeltdager).length).toBe(3);
            expect(enkeltdager['2021-06-01']).toBeUndefined();
            expect(enkeltdager['2021-06-02']).toBeDefined();
            expect(enkeltdager['2021-06-03']).toBeDefined();
            expect(enkeltdager['2021-06-04']).toBeDefined();
            expect(enkeltdager['2021-06-05']).toBeUndefined();
        }
    });
    it('removes omsorgstilbud if erIOmsorgstilbud !== YesOrNo.YES', () => {
        const result = cleanupOmsorgstilbudStep({ ...formValues, omsorgstilbud: undefined }, søknadsperiode);
        expect(result.omsorgstilbud?.enkeltdager).toBeUndefined();
        expect(result.omsorgstilbud?.fasteDager).toBeUndefined();
        expect(result.omsorgstilbud?.erLiktHverUke).toBeUndefined();
    });
});
