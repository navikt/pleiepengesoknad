import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudMåned, TidIOmsorgstilbud } from '@navikt/sif-common-forms/lib/omsorgstilbud/types';
import { VetOmsorgstilbud } from '../../types/PleiepengesøknadApiData';
import { AppFormField, Omsorgstilbud } from '../../types/PleiepengesøknadFormData';
import { getEnkeltdager, mapTilsynsordningToApiData } from '../formToApiMaps/mapTilsynsordningToApiData';

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

const fasteDagerResult = {
    mandag: undefined,
    tirsdag: undefined,
    onsdag: undefined,
    torsdag: undefined,
    fredag: 'PT2H30M',
};

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {},
}));

const tilsyn: Omsorgstilbud = {
    skalBarnIOmsorgstilbud: YesOrNo.YES,
};

const søknadsperiode: DateRange = {
    from: new Date(2021, 5, 1),
    to: new Date(2021, 5, 15),
};

describe('mapTilsynsordningToApiData', () => {
    it('runs', () => {
        expect(1).toBe(1);
    });
    it('should return correct values when NO is selected', () => {
        expect(JSON.stringify(undefined)).toEqual(
            JSON.stringify(mapTilsynsordningToApiData({ skalBarnIOmsorgstilbud: YesOrNo.NO }, søknadsperiode))
        );
    });
    describe(`when ${AppFormField.omsorgstilbud__skalBarnIOmsorgstilbud} === ${YesOrNo.YES}`, () => {
        it(`returns ${VetOmsorgstilbud.VET_IKKE} when ${AppFormField.omsorgstilbud__ja__vetHvorMyeTid} === ${YesOrNo.NO} && ${AppFormField.omsorgstilbud__ja__vetNoeTid} === ${YesOrNo.NO}`, () => {
            const result = mapTilsynsordningToApiData(
                {
                    ...tilsyn,
                    ja: {
                        vetHvorMyeTid: YesOrNo.NO,
                        vetNoeTid: YesOrNo.NO,
                        erLiktHverDag: YesOrNo.YES,
                        fasteDager: { fredag: { hours: '2', minutes: '30' } },
                    },
                },
                søknadsperiode
            );
            expect(result?.vetOmsorgstilbud).toEqual(VetOmsorgstilbud.VET_IKKE);
        });
        it(`returns ${VetOmsorgstilbud.VET_ALLE_TIMER} when ${AppFormField.omsorgstilbud__ja__vetHvorMyeTid} === ${YesOrNo.YES}`, () => {
            const result = mapTilsynsordningToApiData(
                {
                    ...tilsyn,
                    ja: {
                        vetHvorMyeTid: YesOrNo.YES,
                        erLiktHverDag: YesOrNo.YES,
                        fasteDager: { fredag: { hours: '2', minutes: '30' } },
                    },
                },
                søknadsperiode
            );
            expect(result?.vetOmsorgstilbud).toEqual(VetOmsorgstilbud.VET_ALLE_TIMER);
        });
        it(`returns ${VetOmsorgstilbud.VET_IKKE} when ${AppFormField.omsorgstilbud__ja__vetHvorMyeTid} === ${YesOrNo.NO} && ${AppFormField.omsorgstilbud__ja__vetNoeTid} === ${YesOrNo.YES}`, () => {
            const result = mapTilsynsordningToApiData(
                {
                    ...tilsyn,
                    ja: {
                        vetHvorMyeTid: YesOrNo.NO,
                        vetNoeTid: YesOrNo.YES,
                        erLiktHverDag: YesOrNo.YES,
                        fasteDager: { fredag: { hours: '2', minutes: '30' } },
                    },
                },
                søknadsperiode
            );
            expect(result?.vetOmsorgstilbud).toEqual(VetOmsorgstilbud.VET_NOEN_TIMER);
        });
    });
    describe('getFasteDager', () => {
        it('returns fasteDager correctly', () => {
            const result = mapTilsynsordningToApiData(
                {
                    ...tilsyn,
                    ja: {
                        vetHvorMyeTid: YesOrNo.NO,
                        vetNoeTid: YesOrNo.YES,
                        erLiktHverDag: YesOrNo.YES,
                        fasteDager: { fredag: { hours: '2', minutes: '30' } },
                    },
                },
                søknadsperiode
            );
            expect(JSON.stringify(result?.fasteDager)).toEqual(JSON.stringify(fasteDagerResult));
        });
    });
    describe('getEnkeltdager', () => {
        const søknadsperiodeToMåneder: DateRange = {
            from: new Date(2021, 5, 1),
            to: new Date(2021, 6, 6),
        };
        const søknadsperiodeKort: DateRange = {
            from: new Date(2021, 5, 1),
            to: new Date(2021, 5, 10),
        };
        const måneder: OmsorgstilbudMåned[] = [
            {
                skalHaOmsorgstilbud: YesOrNo.NO,
            },
            {
                skalHaOmsorgstilbud: YesOrNo.YES,
            },
        ];
        const enkeltdager: TidIOmsorgstilbud = {
            '2021-06-01': { hours: '2', minutes: '30' },
            '2021-06-02': { hours: '2', minutes: '30' },
            '2021-07-01': { hours: '2', minutes: '30' },
        };

        describe('monthly questions (dialog)', () => {
            it(`returns only days in months where user says skalHaOmsorgstilbud === ${YesOrNo.YES}`, () => {
                const result = getEnkeltdager(måneder, enkeltdager, søknadsperiodeToMåneder);
                expect(result.length).toEqual(1);
                expect(result[0].dato).toEqual('2021-07-01');
                expect(result[0].tid).toEqual('PT2H30M');
            });
            it(`returns only days within søknadsperiode`, () => {
                const result = getEnkeltdager(
                    måneder,
                    {
                        ...enkeltdager,
                        '2021-5-30': { hours: '2', minutes: '30' },
                        '2021-7-02': { hours: '2', minutes: '30' },
                    },
                    søknadsperiodeToMåneder
                );
                expect(result.length).toEqual(1);
                expect(result[0].dato).toEqual('2021-07-01');
                expect(result[0].tid).toEqual('PT2H30M');
            });
        });
        describe('enkeltdager - inline form', () => {
            it(`returns all days when user is asked without month sectioning`, () => {
                const result = getEnkeltdager([], enkeltdager, søknadsperiodeKort);
                expect(result.length).toEqual(2);
                expect(result[0].dato).toEqual('2021-06-01');
                expect(result[0].tid).toEqual('PT2H30M');
                expect(result[1].dato).toEqual('2021-06-02');
                expect(result[1].tid).toEqual('PT2H30M');
            });
        });
    });
});
