import { decimalTimeToTime } from '../timeUtils';

describe('timeUtils', () => {
    it('should convert hours to HoursAndMinutes', () => {
        expect(decimalTimeToTime(1.5)).toEqual({
            hours: 1,
            minutes: 30
        });
    });
});
