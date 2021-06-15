import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { PleiepengesøknadFormData } from '../../../../types/PleiepengesøknadFormData';
import { TidIOmsorgstilbud } from '../../../omsorgstilbud/types';
import { cleanupTilsynsordningStep, getTidIOmsorgstilbudInnenforPeriode } from '../tilsynsordningStepUtils';

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

const formValuesTemplate: Partial<PleiepengesøknadFormData> = {
    omsorgstilbud: {
        skalBarnIOmsorgstilbud: YesOrNo.YES,
        ja: {
            vetHvorMyeTid: YesOrNo.YES,
            erLiktHverDag: YesOrNo.NO,
            enkeltdager: enkeltdagerData,
        },
    },
};

describe('getTidIOmsorgstilbudInnenforPeriode', () => {
    it('extract days within periode', () => {
        const result = getTidIOmsorgstilbudInnenforPeriode(enkeltdagerData, søknadsperiode);
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
        const result = cleanupTilsynsordningStep(formValuesTemplate as PleiepengesøknadFormData, søknadsperiode);
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
});
