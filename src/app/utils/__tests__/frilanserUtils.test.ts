import { isEndDateInPeriod } from '../frilanserUtils';

describe('Frilanser sluttdato er innenfor søknadsperiode', () => {
    it('should return false if frilans end date is before application period ', () => {
        expect(isEndDateInPeriod('2021-01-31', '2021-01-19')).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-31', '2021-01-30')).toBeFalsy();
    });

    it('should return false if frilans end date is undefined', () => {
        expect(isEndDateInPeriod('2021-01-31', undefined)).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-31')).toBeFalsy();
    });

    it('should return false if periodeFra og frilans end date is undefined', () => {
        expect(isEndDateInPeriod(undefined, undefined)).toBeFalsy();
    });

    it('should return true if frilans end date is in eller after application period ', () => {
        expect(isEndDateInPeriod('2021-01-31', '2021-01-31')).toBeTruthy();
        expect(isEndDateInPeriod('2021-01-31', '2021-02-19')).toBeTruthy();
    });
});
