// import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
// import { DateRange, ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
// import { Arbeidsgiver, ArbeidsgiverType } from '../../types';
// import { FrilansFormData } from '../../types/FrilansFormData';
// import { getFrilansApiData } from '../formToApiMaps/getFrilansApiData';

// const frilansoppdrag: Arbeidsgiver[] = [
//     {
//         type: ArbeidsgiverType.FRILANSOPPDRAG,
//         id: '123',
//         navn: 'Teest',
//     },
// ];

describe('getFrilansApiData', () => {
    // const søknadsperiode: DateRange = ISODateRangeToDateRange('2021-01-01/2021-02-01');

    it('is TODO', () => {
        expect(1).toBe(1);
    });

    // describe('når en ikke er frilanser i søknadsperioden', () => {
    //     it('nå bruker svarer nei på om en er frilanser', () => {
    //         const expectedResult = JSON.stringify({
    //             _harHattInntektSomFrilanser: false,
    //         });
    //         const result = getFrilansApiData(
    //             {
    //                 harHattInntektSomFrilanser: YesOrNo.NO,
    //             },
    //             søknadsperiode,
    //             frilansoppdrag
    //         );
    //         expect(JSON.stringify(result)).toEqual(expectedResult);
    //     });
    //     it('ikke er frilanser i perioden det søkes for', () => {
    //         const expectedResult = JSON.stringify({
    //             _harHattInntektSomFrilanser: false,
    //             _frilans: {
    //                 startdato: '2021-02-02',
    //                 jobberFortsattSomFrilans: false,
    //                 sluttdato: '2021-03-02',
    //             },
    //         });
    //         const result = getFrilansApiData(
    //             {
    //                 harHattInntektSomFrilanser: YesOrNo.YES,
    //                 startdato: '2021-02-02',
    //                 sluttdato: '2021-03-02',
    //             },
    //             søknadsperiode,
    //             frilansoppdrag
    //         );
    //         expect(JSON.stringify(result)).toEqual(expectedResult);
    //     });
    // });
    // describe('når en er frilanser', () => {
    //     const formData: FrilansFormData = {
    //         harHattInntektSomFrilanser: YesOrNo.YES,
    //         startdato: '2021-01-01',
    //         jobberFortsattSomFrilans: YesOrNo.YES,
    //     };
    //     it('returnerer riktig data når en er frilanser i perioden, og fortsatt er frilanser', () => {
    //         const result = getFrilansApiData(
    //             {
    //                 ...formData,
    //             },
    //             søknadsperiode,
    //             frilansoppdrag
    //         );
    //         expect(result._harHattInntektSomFrilanser).toBeTruthy();
    //         expect(result.frilans).toBeDefined();
    //         expect(result.frilans?.startdato).toBeDefined();
    //         expect(result.frilans?.jobberFortsattSomFrilans).toBeTruthy();
    //         expect(result.frilans?.sluttdato).toBeUndefined();
    //     });
    //     it('returnerer riktig data når en er frilanser i perioden, men har sluttet som frilanser', () => {
    //         const result = getFrilansApiData(
    //             {
    //                 ...formData,
    //                 jobberFortsattSomFrilans: YesOrNo.NO,
    //                 sluttdato: '2021-01-15',
    //             },
    //             søknadsperiode,
    //             frilansoppdrag
    //         );
    //         expect(result._harHattInntektSomFrilanser).toBeTruthy();
    //         expect(result.frilans).toBeDefined();
    //         expect(result.frilans?.startdato).toBeDefined();
    //         expect(result.frilans?.jobberFortsattSomFrilans).toBeFalsy();
    //         expect(result.frilans?.sluttdato).toBeDefined();
    //     });
    // });
});