import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { PleiepengesøknadFormData } from '../../../../types/PleiepengesøknadFormData';
import { OmsorgstilbudMåned, TidIOmsorgstilbud } from '../../../omsorgstilbud/types';
import { cleanupTilsynsordningStep, fjernTidIOmsorgstilbudUtenforPeriode } from '../tilsynsordningStepUtils';

const søknadsperiode: DateRange = {
    from: new Date(2021, 5, 1),
    to: new Date(2021, 6, 1),
};

const enkeltdagerData: TidIOmsorgstilbud = {
    '2021-05-01': { hours: '2', minutes: '30' }, // Outside range
    '2021-06-01': { hours: '2', minutes: '30' },
    '2021-06-02': { hours: '2', minutes: '30' },
    '2021-07-01': { hours: '2', minutes: '30' },
    '2021-09-01': { hours: '2', minutes: '30' }, // Outside range
};
const månederData: OmsorgstilbudMåned[] = [
    {
        skalHaOmsorgstilbud: YesOrNo.YES,
    },
    {
        skalHaOmsorgstilbud: YesOrNo.YES,
    },
];

const formValuesTemplate: Partial<PleiepengesøknadFormData> = {
    omsorgstilbud: {
        skalBarnIOmsorgstilbud: YesOrNo.YES,
        ja: {
            vetHvorMyeTid: YesOrNo.YES,
            erLiktHverDag: YesOrNo.NO,
            enkeltdager: enkeltdagerData,
            måneder: månederData,
        },
    },
};

describe('fjernTidIOmsorgstilbudUtenforPeriode', () => {
    it('removes days outside periode', () => {
        const result = fjernTidIOmsorgstilbudUtenforPeriode(enkeltdagerData, søknadsperiode);
        expect(Object.keys(result).length).toBe(3);
        expect(result['2021-05-01']).toBeUndefined();
        expect(result['2021-06-01']).toBeDefined();
        expect(result['2021-06-02']).toBeDefined();
        expect(result['2021-07-01']).toBeDefined();
        expect(result['2021-09-01']).toBeUndefined();
    });
});

describe('cleanupTilsynsordningStep', () => {
    it('removes days outside søknadsperiode', () => {
        const result = cleanupTilsynsordningStep(formValuesTemplate as PleiepengesøknadFormData, true, søknadsperiode);
        const enkeltdager = result.omsorgstilbud?.ja?.enkeltdager;
        expect(enkeltdager).toBeDefined();
        if (enkeltdager) {
            expect(enkeltdager['2021-05-01']).toBeUndefined();
            expect(enkeltdager['2021-06-01']).toBeDefined();
            expect(enkeltdager['2021-06-02']).toBeDefined();
            expect(enkeltdager['2021-07-01']).toBeDefined();
            expect(enkeltdager['2021-09-01']).toBeUndefined();
        }
    });
    it('removes days in months user says no', () => {
        const formValues = { ...formValuesTemplate } as PleiepengesøknadFormData;
        formValues.omsorgstilbud = {
            skalBarnIOmsorgstilbud: YesOrNo.YES,
            ...formValuesTemplate.omsorgstilbud,
            ja: {
                ...formValuesTemplate.omsorgstilbud?.ja,
                måneder: [{ skalHaOmsorgstilbud: YesOrNo.NO }, { skalHaOmsorgstilbud: YesOrNo.YES }],
            },
        };

        const result = cleanupTilsynsordningStep(formValues, true, søknadsperiode);
        const enkeltdager = result.omsorgstilbud?.ja?.enkeltdager;
        expect(enkeltdager).toBeDefined();
        if (enkeltdager) {
            expect(enkeltdager['2021-05-01']).toBeUndefined();
            expect(enkeltdager['2021-06-01']).toBeUndefined();
            expect(enkeltdager['2021-06-02']).toBeUndefined();
            expect(enkeltdager['2021-07-01']).toBeDefined();
            expect(enkeltdager['2021-09-01']).toBeUndefined();
        }
    });
});
