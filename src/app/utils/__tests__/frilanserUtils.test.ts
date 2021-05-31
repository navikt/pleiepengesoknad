import { isEndDateInPeriod } from '../frilanserUtils';

describe('Frilanser sluttdato er innenfor søknadsperiode', () => {
    it('should return false if frilans end date is before application period ', () => {
        expect(isEndDateInPeriod('2021-01-31', '2021-01-19')).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-31', '2021-01-30')).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-31', '2020-01-19')).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-31', '2020-01-31')).toBeFalsy();
    });

    it('should return true if frilans end date is in or after application period ', () => {
        expect(isEndDateInPeriod('2021-01-31', '2021-01-31')).toBeTruthy();
        expect(isEndDateInPeriod('2021-01-31', '2021-02-01')).toBeTruthy();
        expect(isEndDateInPeriod('2021-01-31', '2021-02-19')).toBeTruthy();
        expect(isEndDateInPeriod('2021-01-31', '2022-01-31')).toBeTruthy();
    });

    it('should return false if frilans end date is undefined', () => {
        expect(isEndDateInPeriod('2021-01-31', undefined)).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-31')).toBeFalsy();
    });

    it('should return false if periodeFra is undefined', () => {
        expect(isEndDateInPeriod(undefined, '2021-01-31')).toBeFalsy();
    });

    it('should return false if periodeFra and frilans end date is undefined', () => {
        expect(isEndDateInPeriod(undefined, undefined)).toBeFalsy();
    });

    it('should return false if periodeFra and (or) frilans end date has bad format', () => {
        expect(isEndDateInPeriod('45gdg89', '2021-01-31')).toBeFalsy();
        expect(isEndDateInPeriod('2021-32-01', '2021-01-31')).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-32', '2021-01-31')).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-31', '2021-01-32')).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-31', '2021-dr-44')).toBeFalsy();
        expect(isEndDateInPeriod('2021-01-32', '2021-01-31')).toBeFalsy();
    });

    it('should return false if periodeFra has bad format', () => {
        expect(isEndDateInPeriod('undefined23', '344undefined')).toBeFalsy();
    });
});
