import { DateRange } from '@navikt/sif-common-formik/lib';
import { DateDurationMap, DurationWeekdays, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { arbeidEnkeltdagerToArbeidstidEnkeltdagApiData } from '../arbeidToApiDataHelpers';

describe('arbeidToApiDataHelpers', () => {
    const fasteDager: DurationWeekdays = {
        monday: { hours: '3', minutes: '0' },
        tuesday: { hours: '4', minutes: '0' },
        friday: { hours: '5', minutes: '0' },
    };
    const søknadsperiode: DateRange = {
        from: ISODateToDate('2022-01-03'),
        to: ISODateToDate('2022-01-07'),
    };
    describe('arbeidEnkeltdagerToArbeidstidEnkeltdagApiData', () => {
        it.only('fyller faktisk tid med tom tid dersom tid ikke er oppgitt', () => {
            const faktiskArbeid: DateDurationMap = {
                '2022-01-03': { hours: '1', minutes: '0' }, // mandag
                '2022-01-04': { hours: '2', minutes: '0' }, // tirsdag
                // jobber ikke fredag
            };
            const result = arbeidEnkeltdagerToArbeidstidEnkeltdagApiData(faktiskArbeid, fasteDager, søknadsperiode);
            expect(result.length).toEqual(3);
            expect(result[0].dato).toEqual('2022-01-03');
            expect(result[0].arbeidstimer.faktiskTimer).toEqual('PT1H0M');
            expect(result[0].arbeidstimer.normalTimer).toEqual('PT3H0M');
            expect(result[1].dato).toEqual('2022-01-04');
            expect(result[1].arbeidstimer.faktiskTimer).toEqual('PT2H0M');
            expect(result[1].arbeidstimer.normalTimer).toEqual('PT4H0M');
            expect(result[2].dato).toEqual('2022-01-07');
            expect(result[2].arbeidstimer.faktiskTimer).toEqual('PT0H0M');
            expect(result[2].arbeidstimer.normalTimer).toEqual('PT5H0M');
        });
    });
});
