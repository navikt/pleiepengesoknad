import * as fødselsnummerValidator from './../fødselsnummerValidator';
import {
    hasValue,
    validateForeløpigFødselsnummer,
    validateFradato,
    validateFødselsnummer,
    validateLegeerklæring,
    validateNavn,
    validateRelasjonTilBarnet,
    validateTildato,
    validateYesOrNoIsAnswered
} from '../fieldValidations';
import * as dateUtils from './../../utils/dateUtils';
import Mock = jest.Mock;
import { YesOrNo } from '../../types/YesOrNo';
const moment = require('moment');

jest.mock('../fødselsnummerValidator', () => {
    return {
        fødselsnummerIsValid: jest.fn(),
        FødselsnummerValidationErrorReason: {
            MustConsistOf11Digits: 'MustConsistOf11Digits'
        }
    };
});

jest.mock('../../utils/dateUtils', () => {
    return {
        isMoreThan3YearsAgo: jest.fn()
    };
});

describe('fieldValidations', () => {
    const fieldRequiredErrorMsg = 'Feltet er påkrevd';

    describe('hasValue', () => {
        it('should return true if provided value is not undefined, null or empty string', () => {
            expect(hasValue('someValue')).toBe(true);
            expect(hasValue(1234)).toBe(true);
            expect(hasValue([])).toBe(true);
            expect(hasValue({})).toBe(true);
            expect(hasValue(true)).toBe(true);
            expect(hasValue(false)).toBe(true);
        });

        it('should return false if the provided value is undefined, null or empty string', () => {
            expect(hasValue('')).toBe(false);
            expect(hasValue(null)).toBe(false);
            expect(hasValue(undefined)).toBe(false);
        });
    });

    describe('validateFødselsnummer', () => {
        const mockedFnr = '1'.repeat(11);

        it('should return an error message specific for fødselsnummer not being 11 digits when reason for validation failure is MustConsistOf11Digits', () => {
            (fødselsnummerValidator.fødselsnummerIsValid as Mock).mockReturnValue([
                false,
                fødselsnummerValidator.FødselsnummerValidationErrorReason.MustConsistOf11Digits
            ]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerValidator.fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toEqual('Fødselsnummeret må bestå av 11 tall');
        });

        it('should return an error message saying fnr format is validation has failed, but reason is not MustConsistOf11Digits', () => {
            (fødselsnummerValidator.fødselsnummerIsValid as Mock).mockReturnValue([false, []]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerValidator.fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toEqual('Fødselsnummeret er ugyldig');
        });

        it('should return undefined if fødselsnummer is valid', () => {
            (fødselsnummerValidator.fødselsnummerIsValid as Mock).mockReturnValue([true]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerValidator.fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toBeUndefined();
        });
    });

    describe('validateForeløpigFødselsnummer', () => {
        it('should return undefined if value is valid (when it has either 11 digits or no value)', () => {
            expect(validateForeløpigFødselsnummer('1'.repeat(11))).toBeUndefined();
            expect(validateForeløpigFødselsnummer('')).toBeUndefined();
        });

        it('should return an error message saying it must be 11 digits, if provided value is something other than a string with 11 digits', () => {
            const errorMsg = 'Det foreløpige fødselsnummeret / D-nummeret må bestå av 11 tall';
            expect(validateForeløpigFødselsnummer('1234512345')).toEqual(errorMsg);
            expect(validateForeløpigFødselsnummer('1234512345a')).toEqual(errorMsg);
            expect(validateForeløpigFødselsnummer('123451234512')).toEqual(errorMsg);
            expect(validateForeløpigFødselsnummer('12345123451a')).toEqual(errorMsg);
        });
    });

    describe('validateNavn', () => {
        it('should return an error message saying field is required if provided value is empty string and isRequired is set to true', () => {
            expect(validateNavn('', true)).toEqual(fieldRequiredErrorMsg);
        });

        it('should return an error message saying field has to be 50 letters or less, if length is longer than 50 letters', () => {
            const tooLongErrorMsg = 'Navnet kan være maks 50 tegn';
            expect(validateNavn('a'.repeat(51))).toEqual(tooLongErrorMsg);
        });

        it('should return undefined if value is valid (length > 0 && length <= 50)', () => {
            expect(validateNavn('a'.repeat(50))).toBeUndefined();
        });

        it('should return undefined if value is empty string when isRequired set to false', () => {
            expect(validateNavn('', false)).toBeUndefined();
        });
    });

    describe('validateRelasjonTilBarnet', () => {
        it('should return an error message saying field is required if provided value is empty string', () => {
            expect(validateRelasjonTilBarnet('')).toEqual(fieldRequiredErrorMsg);
        });

        it('should return an error message saying field has to be 15 letters or less, if length is longer than 15 letters', () => {
            const tooLongErrorMsg = 'Din relasjon til barnet kan maks være beskrevet på 15 tegn';
            expect(validateRelasjonTilBarnet('a'.repeat(16))).toEqual(tooLongErrorMsg);
        });

        it('should return undefined if value is valid (length > 0 && length <= 15)', () => {
            expect(validateRelasjonTilBarnet('a'.repeat(15))).toBeUndefined();
        });
    });

    const dateIsMoreThan3YearBackInTimeErrorMsg =
        'Du kan ikke søke om pleiepenger for en periode som er mer enn tre år tilbake i tid';
    describe('validateFradato', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it('should return an error message saying field is required if provided value is undefined', () => {
            expect(validateFradato(undefined)).toEqual(fieldRequiredErrorMsg);
        });

        it('should return an error message saying date cannot be more than 3 years back in time, if date is more than 3 years back in time', () => {
            (dateUtils.isMoreThan3YearsAgo as Mock).mockReturnValue(true);
            expect(validateFradato(new Date())).toEqual(dateIsMoreThan3YearBackInTimeErrorMsg);
        });

        it('should return an error message saying that fraDato cannot be after tilDato, if fraDato is after tilDato', () => {
            const today = moment();
            const yesterday = today.clone().subtract(1, 'day');
            const result = validateFradato(today.toDate(), yesterday.toDate());
            expect(result).toEqual('Fra-datoen kan ikke være senere enn til-datoen');
        });

        it('should return undefined if fraDato is inside the last 3 years and equal to or earlier than tilDato', () => {
            const fraDato = moment();
            const tilDato = fraDato.clone();
            expect(validateFradato(fraDato.toDate(), tilDato.toDate())).toBeUndefined();
            const date3YearsAgo = moment()
                .subtract(3, 'years')
                .toDate();
            expect(validateFradato(date3YearsAgo)).toBeUndefined();
        });
    });

    describe('validateTildato', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it('should return an error message saying field is required if provided value is undefined', () => {
            expect(validateTildato(undefined)).toEqual(fieldRequiredErrorMsg);
        });

        it('should return an error message saying date cannot be more than 3 years back in time, if date is more than 3 years back in time', () => {
            (dateUtils.isMoreThan3YearsAgo as Mock).mockReturnValue(true);
            expect(validateFradato(new Date())).toEqual(dateIsMoreThan3YearBackInTimeErrorMsg);
        });

        it('should return an error message saying that tilDato cannot be before fraDato, if tilDato is before fraDato', () => {
            const today = moment();
            const yesterday = today.clone().subtract(1, 'day');
            const result = validateTildato(yesterday.toDate(), today.toDate());
            expect(result).toEqual('Til-datoen kan ikke være tidligere enn fra-datoen');
        });

        it('should return undefined if tilDato is inside the last 3 years and equal to or later than fraDato', () => {
            const tilDato = moment();
            const fraDato = tilDato.clone();
            expect(validateTildato(tilDato.toDate(), fraDato.toDate())).toBeUndefined();
            const date3YearsAgo = moment()
                .subtract(3, 'years')
                .toDate();
            expect(validateTildato(date3YearsAgo)).toBeUndefined();
        });
    });

    describe('validateYesOrNoIsAnswered', () => {
        it('should return undefined if value is YesOrNo.YES', () => {
            expect(validateYesOrNoIsAnswered(YesOrNo.YES)).toBeUndefined();
        });

        it('should return undefined if value is YesOrNo.NO', () => {
            expect(validateYesOrNoIsAnswered(YesOrNo.NO)).toBeUndefined();
        });

        it('should return error message saying that field is required if value is YesOrNo.UNANSWERED', () => {
            expect(validateYesOrNoIsAnswered(YesOrNo.UNANSWERED)).toEqual(fieldRequiredErrorMsg);
        });
    });

    describe('validateLegeerklæring', () => {
        it('should return undefined if the file array contains one or more files', () => {
            expect(validateLegeerklæring([new File([''], 'filename', { type: 'text/png' })])).toBeUndefined();
        });

        it('should return error message saying that files must be uploaded if file-array is empty', () => {
            expect(validateLegeerklæring([])).toEqual('Du må laste opp en legeerklæring');
        });
    });
});
