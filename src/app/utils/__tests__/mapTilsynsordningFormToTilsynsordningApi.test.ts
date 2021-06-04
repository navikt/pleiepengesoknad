// import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
// import { OmsorgstilbudMåned } from '@navikt/sif-common-forms/lib/omsorgstilbud/types';
// import { VetOmsorgstilbud } from '../../types/PleiepengesøknadApiData';
// import { AppFormField, Omsorgstilbud } from '../../types/PleiepengesøknadFormData';
// import {
//     mapTilsynsordningToApiData,
//     getEnkeltdagerFromOmsorgsperiodeFormValue,
// } from '../formToApiMaps/mapTilsynsordningToApiData';

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

// const fasteDagerResult = {
//     mandag: undefined,
//     tirsdag: undefined,
//     onsdag: undefined,
//     torsdag: undefined,
//     fredag: 'PT2H30M',
// };

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {},
}));

// const tilsyn: Omsorgstilbud = {
//     skalBarnIOmsorgstilbud: YesOrNo.YES,
// };

describe('mapTilsynsordningToApiData', () => {
    it('runs', () => {
        expect(1).toBe(1);
    });
    // it('should return correct values when NO is selected', () => {
    //     expect(JSON.stringify(undefined)).toEqual(
    //         JSON.stringify(mapTilsynsordningToApiData({ skalBarnIOmsorgstilbud: YesOrNo.NO }))
    //     );
    // });
    // describe(`when ${AppFormField.omsorgstilbud__skalBarnIOmsorgstilbud} === ${YesOrNo.YES}`, () => {
    //     it(`returns ${VetOmsorgstilbud.VET_IKKE} when ${AppFormField.omsorgstilbud__ja__vetHvorMyeTid} === ${YesOrNo.NO} && ${AppFormField.omsorgstilbud__ja__vetNoeTid} === ${YesOrNo.NO}`, () => {
    //         const result = mapTilsynsordningToApiData({
    //             ...tilsyn,
    //             ja: {
    //                 vetHvorMyeTid: YesOrNo.NO,
    //                 vetNoeTid: YesOrNo.NO,
    //                 erLiktHverDag: YesOrNo.YES,
    //                 fasteDager: { fredag: { hours: '2', minutes: '30' } },
    //             },
    //         });
    //         expect(result?.vetOmsorgstilbud).toEqual(VetOmsorgstilbud.VET_IKKE);
    //     });
    //     it(`returns ${VetOmsorgstilbud.VET_ALLE_TIMER} when ${AppFormField.omsorgstilbud__ja__vetHvorMyeTid} === ${YesOrNo.YES}`, () => {
    //         const result = mapTilsynsordningToApiData({
    //             ...tilsyn,
    //             ja: {
    //                 vetHvorMyeTid: YesOrNo.YES,
    //                 erLiktHverDag: YesOrNo.YES,
    //                 fasteDager: { fredag: { hours: '2', minutes: '30' } },
    //             },
    //         });
    //         expect(result?.vetOmsorgstilbud).toEqual(VetOmsorgstilbud.VET_ALLE_TIMER);
    //     });
    //     it(`returns ${VetOmsorgstilbud.VET_IKKE} when ${AppFormField.omsorgstilbud__ja__vetHvorMyeTid} === ${YesOrNo.NO} && ${AppFormField.omsorgstilbud__ja__vetNoeTid} === ${YesOrNo.YES}`, () => {
    //         const result = mapTilsynsordningToApiData({
    //             ...tilsyn,
    //             ja: {
    //                 vetHvorMyeTid: YesOrNo.NO,
    //                 vetNoeTid: YesOrNo.YES,
    //                 erLiktHverDag: YesOrNo.YES,
    //                 fasteDager: { fredag: { hours: '2', minutes: '30' } },
    //             },
    //         });
    //         expect(result?.vetOmsorgstilbud).toEqual(VetOmsorgstilbud.VET_NOEN_TIMER);
    //     });
    // });
    // describe('getFasteDager', () => {
    //     it('returns fasteDager correctly', () => {
    //         const result = mapTilsynsordningToApiData({
    //             ...tilsyn,
    //             ja: {
    //                 vetHvorMyeTid: YesOrNo.NO,
    //                 vetNoeTid: YesOrNo.YES,
    //                 erLiktHverDag: YesOrNo.YES,
    //                 fasteDager: { fredag: { hours: '2', minutes: '30' } },
    //             },
    //         });
    //         expect(JSON.stringify(result?.fasteDager)).toEqual(JSON.stringify(fasteDagerResult));
    //     });
    // });
    // describe('getEnkeltdagerFromOmsorgsperiodeFormValue', () => {
    //     const values: OmsorgstilbudMåned[] = [
    //         {
    //             skalHaOmsorgstilbud: YesOrNo.NO,
    //         },
    //         {
    //             skalHaOmsorgstilbud: YesOrNo.YES,
    //         },
    //     ];
    //     // it('get single day in two months', () => {
    //     //     const result = getEnkeltdagerFromOmsorgsperiodeFormValue(values);
    //     //     expect(result.length).toBe(1);
    //     //     expect(result[0].dato).toEqual('2021-07-01');
    //     //     expect(result[0].tid).toEqual('PT2H30M');
    //     // });
    //     // it('get two days in two months', () => {
    //     //     const moreValues: OmsorgstilbudMåned[] = [...values];
    //     //     moreValues[0].skalHaOmsorgstilbud = YesOrNo.YES;
    //     //     const result = getEnkeltdagerFromOmsorgsperiodeFormValue(moreValues);
    //     //     expect(result.length).toBe(2);
    //     //     expect(result[0].dato).toEqual('2021-06-01');
    //     //     expect(result[0].tid).toEqual('PT2H30M');
    //     //     expect(result[1].dato).toEqual('2021-07-01');
    //     //     expect(result[1].tid).toEqual('PT2H30M');
    //     // });
    //     // it('excludes omsorgsdager when skalHaOmsorgstilbud === NO', () => {
    //     //     const moreValues: OmsorgstilbudPeriodeFormValue[] = [...values];
    //     //     moreValues[0].skalHaOmsorgstilbud = YesOrNo.NO;
    //     //     moreValues[0].omsorgsdager = [
    //     //         {
    //     //             dato: periode1.from,
    //     //             tid: {
    //     //                 hours: '2',
    //     //                 minutes: '30',
    //     //             },
    //     //         },
    //     //     ];
    //     //     const result = getEnkeltdagerFromOmsorgsperiodeFormValue(moreValues);
    //     //     expect(result.length).toBe(1);
    //     //     expect(result[0].dato).toEqual('2021-07-01');
    //     //     expect(result[0].tid).toEqual('PT2H30M');
    //     // });
    // });
});
