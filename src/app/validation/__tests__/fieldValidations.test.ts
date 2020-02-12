import {
    validateFødselsdato,
    validateFradato,
    validateLegeerklæring,
    validateNavn,
    validateTildato,
    validateNormaleArbeidstimer,
    AppFieldValidationErrors
} from '../fieldValidations';
import * as dateUtils from 'common/utils/dateUtils';
import Mock = jest.Mock;
import { Attachment } from 'common/types/Attachment';
import moment from 'moment';
import { hasValue } from 'common/validation/hasValue';
import { FieldValidationErrors, createFieldValidationError } from 'common/validation/fieldValidations';

jest.mock('common/validation/fødselsnummerValidator', () => {
    return {
        fødselsnummerIsValid: jest.fn(),
        FødselsnummerValidationErrorReason: {
            MustConsistOf11Digits: 'MustConsistOf11Digits'
        }
    };
});

jest.mock('common/utils/dateUtils', () => {
    return {
        isMoreThan3YearsAgo: jest.fn(),
        dateToday: new Date()
    };
});

describe('fieldValidations', () => {
    const fieldRequiredError = createFieldValidationError(FieldValidationErrors.påkrevd);

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

    describe('validateFødselsdato', () => {
        it('should return error if date is after today', () => {
            const tomorrow: Date = moment()
                .add(1, 'day')
                .toDate();
            expect(validateFødselsdato(tomorrow)).toBeDefined();
        });
        it('should return undefined if date is same as today or earlier', () => {
            const yesterday: Date = moment()
                .subtract(1, 'day')
                .toDate();
            expect(validateFødselsdato(yesterday)).toBeUndefined();
            expect(validateFødselsdato(dateUtils.dateToday)).toBeUndefined();
        });
    });

    describe('validateNavn', () => {
        it('should return an error message saying field is required if provided value is empty string and isRequired is set to true', () => {
            expect(validateNavn('', true)).toEqual(fieldRequiredError);
        });

        it('should return an error message saying field has to be 50 letters or less, if length is longer than 50 letters', () => {
            expect(validateNavn('a'.repeat(51))).toEqual(
                createFieldValidationError(AppFieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters: 50 })
            );
        });

        it('should return undefined if value is valid (length > 0 && length <= 50)', () => {
            expect(validateNavn('a'.repeat(50))).toBeUndefined();
        });

        it('should return undefined if value is empty string when isRequired set to false', () => {
            expect(validateNavn('', false)).toBeUndefined();
        });
    });

    describe('validateFradato', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        it('should return an error message saying field is required if provided value is undefined', () => {
            expect(validateFradato(undefined)).toEqual(fieldRequiredError);
        });

        it('should return an error message saying date cannot be more than 3 years back in time, if date is more than 3 years back in time', () => {
            (dateUtils.isMoreThan3YearsAgo as Mock).mockReturnValue(true);
            expect(validateFradato(new Date())).toEqual(
                createFieldValidationError(AppFieldValidationErrors.fradato_merEnnTreÅr)
            );
        });

        it('should return an error message saying that fraDato cannot be after tilDato, if fraDato is after tilDato', () => {
            const today = moment();
            const yesterday = today.clone().subtract(1, 'day');
            const result = validateFradato(today.toDate(), yesterday.toDate());
            expect(result).toEqual(createFieldValidationError(AppFieldValidationErrors.fradato_erEtterTildato));
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
            expect(validateTildato(undefined)).toEqual(fieldRequiredError);
        });

        it('should return an error message saying date cannot be more than 3 years back in time, if date is more than 3 years back in time', () => {
            (dateUtils.isMoreThan3YearsAgo as Mock).mockReturnValue(true);
            expect(validateTildato(new Date())).toEqual(
                createFieldValidationError(AppFieldValidationErrors.tildato_merEnnTreÅr)
            );
        });

        it('should return an error message saying that tilDato cannot be before fraDato, if tilDato is before fraDato', () => {
            const today = moment();
            const yesterday = today.clone().subtract(1, 'day');
            const result = validateTildato(yesterday.toDate(), today.toDate());
            expect(result).toEqual(createFieldValidationError(AppFieldValidationErrors.tildato_erFørFradato));
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

    describe('validateLegeerklæring', () => {
        const fileMock = new File([''], 'filename.png', { type: 'text/png' });

        const uploadedAttachment: Attachment = { file: fileMock, pending: false, uploaded: true };
        const failedAttachment1: Attachment = { file: fileMock, pending: true, uploaded: false };
        const failedAttachment2: Attachment = { file: fileMock, pending: false, uploaded: false };

        it('should return error message saying that files must be uploaded if list is empty', () => {
            expect(validateLegeerklæring([])).toEqual(
                createFieldValidationError(AppFieldValidationErrors.legeerklæring_mangler)
            );
        });

        it('should return error message saying that files must be uploaded if list contains no successfully uploaded attachments', () => {
            expect(validateLegeerklæring([failedAttachment1, failedAttachment2])).toEqual(
                createFieldValidationError(AppFieldValidationErrors.legeerklæring_mangler)
            );
        });

        it('should return undefined if list contains between 1-3 successfully uploaded attachments', () => {
            expect(validateLegeerklæring([uploadedAttachment])).toBeUndefined();
            expect(validateLegeerklæring([uploadedAttachment, uploadedAttachment])).toBeUndefined();
            expect(validateLegeerklæring([uploadedAttachment, uploadedAttachment, uploadedAttachment])).toBeUndefined();
        });

        it('should return error message saying no more than 3 files if list contains 4 files or more', () => {
            expect(
                validateLegeerklæring([uploadedAttachment, uploadedAttachment, uploadedAttachment, uploadedAttachment])
            ).toEqual(createFieldValidationError(AppFieldValidationErrors.legeerklæring_forMangeFiler));
        });
    });

    describe('validate arbeidsforhold', () => {
        it('should only allow values from 1 and 150', () => {
            expect(validateNormaleArbeidstimer({ hours: 0, minutes: 0 })).toEqual(
                createFieldValidationError(AppFieldValidationErrors.arbeidsforhold_timerUgyldig, { min: 1, max: 150 })
            );
        });
    });
});
