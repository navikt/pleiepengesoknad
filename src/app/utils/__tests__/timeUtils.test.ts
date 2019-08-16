import { convertHoursToHoursAndMinutes, convertHoursToIso8601Duration } from '../timeUtils';

describe('timeUtils', () => {
    it('should convert hours to HoursAndMinutes', () => {
        expect(convertHoursToHoursAndMinutes(1.5)).toEqual({
            hours: 1,
            minutes: 30
        });
    });
    it('should send timer in ISO8601Duration format', () => {
        expect(convertHoursToIso8601Duration(37.5)).toEqual('PT37H30M');
        expect(convertHoursToIso8601Duration(0)).toEqual('PT0H0M');
    });
});
