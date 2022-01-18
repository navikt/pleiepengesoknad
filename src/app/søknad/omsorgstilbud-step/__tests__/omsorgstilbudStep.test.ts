import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { DateDurationMap } from '@navikt/sif-common-utils';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { cleanupOmsorgstilbudStep } from '../omsorgstilbudStepUtils';

const søknadsperiode: DateRange = {
    from: new Date(2021, 5, 2),
    to: new Date(2021, 5, 4),
};

const søknadsdato = new Date(2021, 5, 3);

const enkeldagerFormData: DateDurationMap = {
    '2021-06-01': { hours: '2', minutes: '30' }, // Outside range
    '2021-06-02': { hours: '2', minutes: '30' }, // Historic
    '2021-06-03': { hours: '2', minutes: '30' }, // Planned
    '2021-06-04': { hours: '2', minutes: '30' }, // Planned
    '2021-06-05': { hours: '2', minutes: '30' }, // Outside range
};

const formValuesTemplate: Partial<SøknadFormData> = {
    omsorgstilbud: {
        skalBarnIOmsorgstilbud: YesOrNo.YES,
        harBarnVærtIOmsorgstilbud: YesOrNo.YES,
        planlagt: {
            erLiktHverUke: YesOrNo.NO,
            enkeltdager: enkeldagerFormData,
        },
        historisk: {
            enkeltdager: enkeldagerFormData,
        },
    },
};

const formValues = formValuesTemplate as SøknadFormData;

describe('cleanupOmsorgstilbudStep', () => {
    it('removes days outside søknadsperiode - historisk', () => {
        const result = cleanupOmsorgstilbudStep(formValues, søknadsperiode, søknadsdato);
        const enkeltdager = result.omsorgstilbud?.historisk?.enkeltdager;
        expect(enkeltdager).toBeDefined();
        if (enkeltdager) {
            expect(Object.keys(enkeltdager).length).toBe(1);
            expect(enkeltdager['2021-06-01']).toBeUndefined();
            expect(enkeltdager['2021-06-02']).toBeDefined();
            expect(enkeltdager['2021-06-03']).toBeUndefined();
            expect(enkeltdager['2021-06-04']).toBeUndefined();
            expect(enkeltdager['2021-06-05']).toBeUndefined();
        }
    });
    it('removes days outside søknadsperiode - planlagt', () => {
        const result = cleanupOmsorgstilbudStep(formValues, søknadsperiode, søknadsdato);
        const enkeltdager = result.omsorgstilbud?.planlagt?.enkeltdager;
        expect(enkeltdager).toBeDefined();
        if (enkeltdager) {
            expect(Object.keys(enkeltdager).length).toBe(2);
            expect(enkeltdager['2021-06-01']).toBeUndefined();
            expect(enkeltdager['2021-06-02']).toBeUndefined();
            expect(enkeltdager['2021-06-03']).toBeDefined();
            expect(enkeltdager['2021-06-04']).toBeDefined();
            expect(enkeltdager['2021-06-05']).toBeUndefined();
        }
    });
    it('removes planlagt if skalBarnIOmsorgstilbud === YesOrNo.NO', () => {
        const formValuesLocal = { ...formValues };
        formValuesLocal.omsorgstilbud = {
            skalBarnIOmsorgstilbud: YesOrNo.NO,
        };
        const result = cleanupOmsorgstilbudStep(formValuesLocal, søknadsperiode, søknadsdato);
        expect(result.omsorgstilbud?.planlagt).toBeUndefined();
    });
    it('removes historisk if harBarnVærtIOmsorgstilbud === YesOrNo.NO', () => {
        const formValuesLocal = { ...formValues };
        formValuesLocal.omsorgstilbud = {
            harBarnVærtIOmsorgstilbud: YesOrNo.NO,
        };
        const result = cleanupOmsorgstilbudStep(formValuesLocal, søknadsperiode, søknadsdato);
        expect(result.omsorgstilbud?.historisk).toBeUndefined();
    });
});
