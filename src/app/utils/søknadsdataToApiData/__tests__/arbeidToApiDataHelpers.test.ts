import { DateRange } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, DurationWeekdays, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { arbeidEnkeltdagerToArbeidstidEnkeltdagApiData } from '../arbeidToApiDataHelpers';

describe('arbeidToApiDataHelpers', () => {
    const fasteDager: DurationWeekdays = {
        monday: { hours: '3', minutes: '30' },
        tuesday: { hours: '4', minutes: '30' },
        friday: { hours: '5', minutes: '30' },
    };
    const søknadsperiode: DateRange = {
        from: ISODateToDate('2022-01-03'),
        to: ISODateToDate('2022-01-07'),
    };
    describe('arbeidEnkeltdagerToArbeidstidEnkeltdagApiData', () => {
        it('fyller default faktisk tid med tom tid dersom tid ikke er oppgitt', () => {
            const faktiskArbeid: DateDurationMap = {
                '2022-01-03': { hours: '1', minutes: '0' }, // mandag
                '2022-01-04': { hours: '2', minutes: '0' }, // tirsdag
                // jobber ikke fredag
            };
            const result = arbeidEnkeltdagerToArbeidstidEnkeltdagApiData(faktiskArbeid, fasteDager, søknadsperiode);
            expect(result.length).toEqual(3);
            expect(result[0].dato).toEqual('2022-01-03');
            expect(result[0].arbeidstimer.faktiskTimer).toEqual('PT1H0M');
            expect(result[0].arbeidstimer.normalTimer).toEqual('PT3H30M');
            expect(result[1].dato).toEqual('2022-01-04');
            expect(result[1].arbeidstimer.faktiskTimer).toEqual('PT2H0M');
            expect(result[1].arbeidstimer.normalTimer).toEqual('PT4H30M');
            expect(result[2].dato).toEqual('2022-01-07');
            expect(result[2].arbeidstimer.faktiskTimer).toEqual('PT0H0M');
            expect(result[2].arbeidstimer.normalTimer).toEqual('PT5H30M');
        });
        it('avkorter enkeltdager til aktiv arbeidsperiode, f.eks. frilanser som starter/slutter i søknadsperiode', () => {
            const faktiskArbeid: DateDurationMap = {
                '2022-01-03': { hours: '1', minutes: '0' }, // mandag
                '2022-01-04': { hours: '2', minutes: '0' }, // tirsdag
            };
            const søknadsperiodeIntern: DateRange = {
                from: ISODateToDate('2022-01-03'),
                to: ISODateToDate('2022-01-14'), // fredag påfølgende uke
            };

            const erAnsattPeriode: DateRange = {
                from: ISODateToDate('2022-01-04'),
                to: ISODateToDate('2022-01-11'),
            };

            const result = arbeidEnkeltdagerToArbeidstidEnkeltdagApiData(
                faktiskArbeid,
                fasteDager,
                søknadsperiodeIntern,
                erAnsattPeriode
            );
            /** Skal returnere :
             *  - mandag utelatt pga utenfor ansatt periode
             *  0: tir med oppgitt faktisk tid
             *  1: fre med faktisk fylt med 0
             *  2: man med faktisk fylt med 0
             *  3: tir med faktisk fylt med 0
             *  - fredag utelatt pga utenfor ansatt periode
             * */
            expect(result.length).toEqual(4);
            expect(result[0].dato).toEqual('2022-01-04');
            expect(result[0].arbeidstimer.faktiskTimer).toEqual('PT2H0M');
            expect(result[0].arbeidstimer.normalTimer).toEqual('PT4H30M');
            expect(result[1].dato).toEqual('2022-01-07');
            expect(result[1].arbeidstimer.faktiskTimer).toEqual('PT0H0M');
            expect(result[1].arbeidstimer.normalTimer).toEqual('PT5H30M');
            expect(result[2].dato).toEqual('2022-01-10');
            expect(result[2].arbeidstimer.faktiskTimer).toEqual('PT0H0M');
            expect(result[2].arbeidstimer.normalTimer).toEqual('PT3H30M');
            expect(result[3].dato).toEqual('2022-01-11');
            expect(result[3].arbeidstimer.faktiskTimer).toEqual('PT0H0M');
            expect(result[3].arbeidstimer.normalTimer).toEqual('PT4H30M');
        });
    });
});
