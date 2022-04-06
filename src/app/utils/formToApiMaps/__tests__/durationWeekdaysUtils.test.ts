import { Duration, DurationWeekdays, Weekday } from '@navikt/sif-common-utils/lib';
import {
    durationHasSomeDuration,
    getWeekdaysWithDuration,
    getAllWeekdaysWithoutDuration,
} from '../../durationWeekdaysUtils';
const duration: Duration = {
    hours: '1',
    minutes: '0',
};
describe('durationWeekdaysUtils', () => {
    duration;
    const fullWeek: DurationWeekdays = {
        monday: { ...duration },
        tuesday: { ...duration },
        wednesday: { ...duration },
        thursday: { ...duration },
        friday: { ...duration },
    };
    describe('durationHasSomeDuration', () => {
        it('returnerer true når duration er over 0 minutter', () => {
            expect(durationHasSomeDuration({ hours: '0', minutes: '1' })).toBeTruthy();
        });
        it('returnerer false når duration er undefined', () => {
            expect(durationHasSomeDuration(undefined)).toBeFalsy();
        });
        it('returnerer false når duration er 0 minutter', () => {
            expect(durationHasSomeDuration({ hours: '0', minutes: '0' })).toBeFalsy();
        });
    });
    describe('getWeekdaysWithDuration', () => {
        it('returnerer alle ukedager når alle ukedager har varighet', () => {
            const weekdays = getWeekdaysWithDuration(fullWeek);
            expect(weekdays.length).toEqual(5);
            expect(weekdays[0]).toEqual(Weekday.monday);
            expect(weekdays[1]).toEqual(Weekday.tuesday);
            expect(weekdays[2]).toEqual(Weekday.wednesday);
            expect(weekdays[3]).toEqual(Weekday.thursday);
            expect(weekdays[4]).toEqual(Weekday.friday);
        });
        it('returnerer ikke ukedag som har varighet === undefined ', () => {
            const weekdays = getWeekdaysWithDuration({ thursday: { hours: '1', minutes: '0' }, friday: undefined });
            expect(weekdays.length).toEqual(1);
            expect(weekdays[0]).toEqual(Weekday.thursday);
        });
        it('returnerer ikke ukedag som har varighet === 0 timer 0 minutter ', () => {
            const weekdays = getWeekdaysWithDuration({
                thursday: { hours: '1', minutes: '0' },
                friday: { hours: '0', minutes: '0' },
            });
            expect(weekdays.length).toEqual(1);
            expect(weekdays[0]).toEqual(Weekday.thursday);
        });
    });
    describe('getAllWeekdaysWithoutDuration', () => {
        it('returnerer ingen ukedager når alle ukedager har varighet', () => {
            const weekdays = getAllWeekdaysWithoutDuration(fullWeek);
            expect(weekdays.length).toEqual(0);
        });
        it('returnerer alle ukedager når ingen ukedager har varighet', () => {
            const weekdays = getAllWeekdaysWithoutDuration({});
            expect(weekdays.length).toEqual(5);
            expect(weekdays[0]).toEqual(Weekday.monday);
            expect(weekdays[1]).toEqual(Weekday.tuesday);
            expect(weekdays[2]).toEqual(Weekday.wednesday);
            expect(weekdays[3]).toEqual(Weekday.thursday);
            expect(weekdays[4]).toEqual(Weekday.friday);
        });
        it('returnerer ukedag som har varighet === undefined, eller som ikke er definert i weekdays', () => {
            const weekdays = getAllWeekdaysWithoutDuration({ friday: { hours: '1', minutes: '0' } });
            expect(weekdays.length).toEqual(4);
            expect(weekdays[3]).toEqual(Weekday.thursday);
        });
        it('returnerer alle ukedager som har varighet === 0 timer 0 minutter, eller som ikke er definert i weekdays', () => {
            const weekdays = getAllWeekdaysWithoutDuration({
                monday: { hours: '1', minutes: '0' },
                tuesday: { hours: '0', minutes: '0' },
                thursday: { hours: '1', minutes: '0' },
                friday: { hours: '0', minutes: '0' },
            });
            expect(weekdays.length).toEqual(3);
            expect(weekdays[0]).toEqual(Weekday.tuesday);
            expect(weekdays[1]).toEqual(Weekday.wednesday);
            expect(weekdays[2]).toEqual(Weekday.friday);
        });
    });
});
