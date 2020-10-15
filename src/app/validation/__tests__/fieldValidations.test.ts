import moment from 'moment';
import { Attachment } from '@sif-common/core/types/Attachment';
import * as dateUtils from '@sif-common/core/utils/dateUtils';
import { createFieldValidationError, FieldValidationErrors } from '@sif-common/core/validation/fieldValidations';
import { hasValue } from '@sif-common/core/validation/hasValue';
import {
    AppFieldValidationErrors,
    validateFradato,
    validateFødselsdato,
    validateLegeerklæring,
    validateNavn,
    validateNormaleArbeidstimer,
    validateTildato,
} from '../fieldValidations';

import Mock = jest.Mock;
import { createFormikDatepickerValue } from '@navikt/sif-common-formik/lib';

jest.mock('../../utils/envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

jest.mock('@sif-common/core/validation/fødselsnummerValidator', () => {
    return {
        fødselsnummerIsValid: jest.fn(),
        FødselsnummerValidationErrorReason: {
            MustConsistOf11Digits: 'MustConsistOf11Digits',
        },
    };
});

jest.mock('@sif-common/core/utils/dateUtils', () => {
    return {
        isMoreThan3YearsAgo: jest.fn(),
        dateToday: new Date(),
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
            const tomorrow: Date = moment().add(1, 'day').toDate();
            expect(validateFødselsdato(createFormikDatepickerValue(tomorrow))).toBeDefined();
        });
        it('should return undefined if date is same as today or earlier', () => {
            const yesterday: Date = moment().subtract(1, 'day').toDate();
            expect(validateFødselsdato(createFormikDatepickerValue(yesterday))).toBeUndefined();
            expect(validateFødselsdato(createFormikDatepickerValue(dateUtils.dateToday))).toBeUndefined();
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
            expect(validateFradato(createFormikDatepickerValue(new Date()))).toEqual(
                createFieldValidationError(AppFieldValidationErrors.fradato_merEnnTreÅr)
            );
        });

        it('should return an error message saying that fraDato cannot be after tilDato, if fraDato is after tilDato', () => {
            const today = moment();
            const yesterday = today.clone().subtract(1, 'day');
            const result = validateFradato(
                createFormikDatepickerValue(today.toDate()),
                createFormikDatepickerValue(yesterday.toDate())
            );
            expect(result).toEqual(createFieldValidationError(AppFieldValidationErrors.fradato_erEtterTildato));
        });

        it('should return undefined if fraDato is inside the last 3 years and equal to or earlier than tilDato', () => {
            const fraDato = moment();
            const tilDato = fraDato.clone();
            expect(
                validateFradato(
                    createFormikDatepickerValue(fraDato.toDate()),
                    createFormikDatepickerValue(tilDato.toDate())
                )
            ).toBeUndefined();
            const date3YearsAgo = moment().subtract(3, 'years').toDate();
            expect(validateFradato(createFormikDatepickerValue(date3YearsAgo))).toBeUndefined();
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
            expect(validateTildato(createFormikDatepickerValue(new Date()))).toEqual(
                createFieldValidationError(AppFieldValidationErrors.tildato_merEnnTreÅr)
            );
        });

        it('should return an error message saying that tilDato cannot be before fraDato, if tilDato is before fraDato', () => {
            const today = moment();
            const yesterday = today.clone().subtract(1, 'day');
            const result = validateTildato(
                createFormikDatepickerValue(yesterday.toDate()),
                createFormikDatepickerValue(today.toDate())
            );
            expect(result).toEqual(createFieldValidationError(AppFieldValidationErrors.tildato_erFørFradato));
        });

        it('should return undefined if tilDato is inside the last 3 years and equal to or later than fraDato', () => {
            const tilDato = moment();
            const fraDato = tilDato.clone();
            const til = createFormikDatepickerValue(tilDato.toDate());
            const fra = createFormikDatepickerValue(fraDato.toDate());
            expect(validateTildato(til, fra)).toBeUndefined();
            const date3YearsAgo = moment().subtract(3, 'years').toDate();
            expect(validateTildato(createFormikDatepickerValue(date3YearsAgo))).toBeUndefined();
        });
    });

    describe('validateLegeerklæring', () => {
        const fileMock = new File([''], 'filename.png', { type: 'text/png' });

        const uploadedAttachment: Attachment = { file: fileMock, pending: false, uploaded: true };
        it('should return undefined if list contains between 1-3 successfully uploaded attachments', () => {
            expect(validateLegeerklæring([uploadedAttachment])).toBeUndefined();
            expect(validateLegeerklæring([uploadedAttachment, uploadedAttachment])).toBeUndefined();
            expect(validateLegeerklæring([uploadedAttachment, uploadedAttachment, uploadedAttachment])).toBeUndefined();
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
