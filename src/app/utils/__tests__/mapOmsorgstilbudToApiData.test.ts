import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { TidEnkeltdag } from '../../types';
import { Omsorgstilbud } from '../../types/PleiepengesøknadFormData';
import { mapPlanlagtOmsorgstilbudToApiData } from '../formToApiMaps/omsorgstilbudApiData';
import { getEnkeltdagerIPeriodeApiData } from '../formToApiMaps/tidsbrukApiUtils';

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

const søknadsdato = new Date();

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {},
}));

const omsorgstilbud: Omsorgstilbud = {
    skalBarnIOmsorgstilbud: YesOrNo.YES,
};

const søknadsperiode: DateRange = {
    from: new Date(2021, 5, 1),
    to: new Date(2021, 5, 15),
};

describe('mapOmsorgstilbudToApiData test', () => {
    it('should return correct values when NO is selected', () => {
        expect(JSON.stringify(undefined)).toEqual(
            JSON.stringify(
                mapPlanlagtOmsorgstilbudToApiData({ skalBarnIOmsorgstilbud: YesOrNo.NO }, søknadsperiode, søknadsdato)
            )
        );
    });
    describe('getFasteDager', () => {
        it('returns fasteDager correctly', () => {
            const result = mapPlanlagtOmsorgstilbudToApiData(
                {
                    ...omsorgstilbud,
                    planlagt: {
                        erLiktHverUke: YesOrNo.YES,
                        fasteDager: { fredag: { hours: '2', minutes: '30' } },
                    },
                },
                søknadsperiode,
                søknadsdato
            );
            expect(JSON.stringify(result?.ukedager)).toEqual(JSON.stringify(fasteDagerResult));
        });
    });
    describe('getEnkeltdager', () => {
        const enkeltdager: TidEnkeltdag = {
            '2021-06-01': { hours: '2', minutes: '30' },
            '2021-06-02': { hours: '2', minutes: '31' },
            '2021-07-01': { hours: '2', minutes: '32' },
        };

        it(`returns only days within søknadsperiode - 1`, () => {
            const result = getEnkeltdagerIPeriodeApiData(
                {
                    ...enkeltdager,
                    '2021-05-30': { hours: '2', minutes: '30' }, // To early
                    '2021-07-02': { hours: '2', minutes: '30' }, // To late
                },
                {
                    from: new Date(2021, 5, 1),
                    to: new Date(2021, 6, 1),
                }
            );
            expect(result.length).toEqual(3);
            expect(result[0].dato).toEqual('2021-06-01');
            expect(result[1].dato).toEqual('2021-06-02');
            expect(result[2].dato).toEqual('2021-07-01');
            expect(result[0].tid).toEqual('PT2H30M');
        });
        it(`returns only days within søknadsperiode - 2`, () => {
            const result = getEnkeltdagerIPeriodeApiData(
                {
                    ...enkeltdager,
                    '2021-05-30': { hours: '2', minutes: '30' },
                    '2021-07-02': { hours: '4', minutes: '40' },
                },
                {
                    from: new Date(2021, 6, 2),
                    to: new Date(2021, 7, 1),
                }
            );
            expect(result.length).toEqual(1);
            expect(result[0].dato).toEqual('2021-07-02');
            expect(result[0].tid).toEqual('PT4H40M');
        });
    });
});
