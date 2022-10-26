import { DateRange } from '@navikt/sif-common-formik/lib';
import { ISODateRangeToDateRange, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { getNumberOfWorkdaysInWeek } from '../weekOfYearUtils';

describe('weekOfYearUtils', () => {
    describe('getNumberOfWorkdaysInWeek', () => {
        // const dateRange: DateRange = ISODateRangeToDateRange('2022-01-03/2022-01-09');
        const mandag: Date = ISODateToDate('2022-01-03');
        const tirsdag: Date = ISODateToDate('2022-01-04');
        const torsdag: Date = ISODateToDate('2022-01-06');
        const fredag: Date = ISODateToDate('2022-01-07');
        const lørdag: Date = ISODateToDate('2022-01-08');
        const søndag: Date = ISODateToDate('2022-01-09');
        it('returnerer riktig for en hel uke (mandag til søndag)', () => {
            const result = getNumberOfWorkdaysInWeek({ from: mandag, to: søndag });
            expect(result).toEqual(5);
        });
        it('returnerer riktig for en uke som er fra mandag til fredag', () => {
            const result = getNumberOfWorkdaysInWeek({ from: mandag, to: fredag });
            expect(result).toEqual(5);
        });
        it('returnerer riktig for en uke som er fra tirsdag til søndag', () => {
            const result = getNumberOfWorkdaysInWeek({ from: tirsdag, to: søndag });
            expect(result).toEqual(4);
        });
        it('returnerer riktig for en uke som er fra tirsdag til torsdag', () => {
            const result = getNumberOfWorkdaysInWeek({ from: tirsdag, to: torsdag });
            expect(result).toEqual(3);
        });
        it('returnerer riktig for en uke som er fra mandag til mandag', () => {
            const result = getNumberOfWorkdaysInWeek({ from: tirsdag, to: torsdag });
            expect(result).toEqual(3);
        });
        it('returnerer riktig for en uke som er fra lørdag til søndag', () => {
            const result = getNumberOfWorkdaysInWeek({ from: lørdag, to: søndag });
            expect(result).toEqual(0);
        });
    });
});
