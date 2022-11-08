import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { periodeInneholderToHeleArbeidsuker } from '../../søknad/arbeidstid-step/utils/arbeidstidUtils';
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

    describe('periodeInneholderToHeleUker', () => {
        const uke1 = {
            mandag: ISODateToDate('2022-01-03'),
            tirsdag: ISODateToDate('2022-01-04'),
            torsdag: ISODateToDate('2022-01-06'),
            fredag: ISODateToDate('2022-01-07'),
        };
        const uke2 = {
            mandag: ISODateToDate('2022-01-10'),
            fredag: ISODateToDate('2022-01-14'),
        };
        const uke3 = {
            mandag: ISODateToDate('2022-01-17'),
            fredag: ISODateToDate('2022-01-21'),
        };

        it('returner true dersom en starter mandag uke1 i og slutter fredag uke 2', () => {
            expect(periodeInneholderToHeleArbeidsuker({ from: uke1.mandag, to: uke2.fredag })).toBe(true);
        });
        it('returner false dersom en starter mandag uke1 i og slutter torsdag uke 2', () => {
            expect(periodeInneholderToHeleArbeidsuker({ from: uke1.tirsdag, to: uke2.fredag })).toBe(false);
        });
        it('returner false dersom en starter tirsdag uke1 i og slutter fredag uke 2', () => {
            expect(periodeInneholderToHeleArbeidsuker({ from: uke1.tirsdag, to: uke2.fredag })).toBe(false);
        });
        it('returner true dersom en starter fredag uke1 i og slutter fredag uke 3', () => {
            expect(periodeInneholderToHeleArbeidsuker({ from: uke1.fredag, to: uke3.fredag })).toBe(true);
        });
    });
});
