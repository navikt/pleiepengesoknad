import { fødselsnummerIsValid } from '../fødselsnummerValidator';
import { FødselsnummerMockedValidity } from '../../../../__mocks__/@navikt/fnrvalidator';

describe('fødselsnummerIsValid', () => {
    it('should return an array containing true (index 0) and empty array (index 1) if fødselsnummer was valid', () => {
        const [isValid, reasons] = fødselsnummerIsValid(FødselsnummerMockedValidity.VALID);
        expect(isValid).toBe(true);
        expect(reasons).toHaveLength(0);
    });

    it('should return an array containing false (index 0) and an array of reasons (index 1) if fødselsnummer was invalid', () => {
        const [isValid, reasons] = fødselsnummerIsValid(FødselsnummerMockedValidity.INVALID);
        expect(isValid).toBe(false);
        expect(reasons).toHaveLength(1);
    });
});
