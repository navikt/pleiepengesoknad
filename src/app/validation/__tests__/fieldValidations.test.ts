import moment from 'moment';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import {
    createFieldValidationError,
    FieldValidationErrors,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { dateToISOFormattedDateString, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    AppFieldValidationErrors,
    validateFradato,
    validateFødselsdato,
    validateLegeerklæring,
    validateNavn,
    validateTildato,
} from '../fieldValidations';

jest.mock('../../utils/envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

jest.mock('@navikt/sif-common-core/lib/validation/fødselsnummerValidator', () => {
    return {
        fødselsnummerIsValid: jest.fn(),
        FødselsnummerValidationErrorReason: {
            MustConsistOf11Digits: 'MustConsistOf11Digits',
        },
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
            const tomorrow: string | undefined = dateToISOFormattedDateString(moment().add(1, 'day').toDate());
            expect(validateFødselsdato(tomorrow)).toBeDefined();
        });
        it('should return undefined if date is same as today or earlier', () => {
            const yesterday: string | undefined = dateToISOFormattedDateString(moment().subtract(1, 'day').toDate());
            const today: string | undefined = dateToISOFormattedDateString(dateToday);
            expect(validateFødselsdato(yesterday)).toBeUndefined();
            expect(validateFødselsdato(today)).toBeUndefined();
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
            const threeYearsAgoDate = moment().subtract(3, 'years').subtract(1, 'day').toDate();
            expect(validateFradato(dateToISOFormattedDateString(threeYearsAgoDate))).toEqual(
                createFieldValidationError(AppFieldValidationErrors.fradato_merEnnTreÅr)
            );
        });

        it('should return an error message saying that fraDato cannot be after tilDato, if fraDato is after tilDato', () => {
            const todayMoment = moment();
            const today = dateToISOFormattedDateString(todayMoment.toDate());
            const yesterday = dateToISOFormattedDateString(todayMoment.clone().subtract(1, 'day').toDate());
            const result = validateFradato(today, yesterday);
            expect(result).toEqual(createFieldValidationError(AppFieldValidationErrors.fradato_erEtterTildato));
        });

        it('should return undefined if fraDato is inside the last 3 years and equal to or earlier than tilDato', () => {
            const date = new Date('2021-02-09T13:42:45.219Z');
            const fraDato = dateToISOFormattedDateString(date);
            const tilDato = dateToISOFormattedDateString(date);
            expect(validateFradato(fraDato, tilDato)).toBeUndefined();
            const date3YearsAgo = dateToISOFormattedDateString(moment(date).subtract(3, 'years').toDate());
            expect(validateFradato(date3YearsAgo)).toBeUndefined();
        });

        it('should return error message if fraDato is weekend', () => {
            const fraDato = dateToISOFormattedDateString(new Date('02.06.2021'));
            const tilDato = dateToISOFormattedDateString(new Date('03.31.2021'));
            expect(validateFradato(fraDato, tilDato)).toEqual(
                createFieldValidationError(AppFieldValidationErrors.er_helg)
            );
        });

        it('should return undefined if fraDato is not weekend', () => {
            const fraDato = dateToISOFormattedDateString(new Date('02.01.2021'));
            const tilDato = dateToISOFormattedDateString(new Date('03.31.2021'));
            expect(validateFradato(fraDato, tilDato)).toBeUndefined();
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
            const threeYearsAgoDate = moment().subtract(3, 'years').subtract(1, 'day').toDate();
            expect(validateTildato(dateToISOFormattedDateString(threeYearsAgoDate))).toEqual(
                createFieldValidationError(AppFieldValidationErrors.tildato_merEnnTreÅr)
            );
        });

        it('should return an error message saying that tilDato cannot be before fraDato, if tilDato is before fraDato', () => {
            const date = moment(new Date('02.05.2021'));
            const daybefore = date.clone().subtract(1, 'day');
            const result = validateTildato(
                dateToISOFormattedDateString(daybefore.toDate()),
                dateToISOFormattedDateString(date.toDate())
            );
            expect(result).toEqual(createFieldValidationError(AppFieldValidationErrors.tildato_erFørFradato));
        });

        it('should return undefined if tilDato is inside the last 3 years and equal to or later than fraDato', () => {
            const tilDato = moment(new Date('2021-02-09T13:42:45.219Z'));
            const fraDato = tilDato.clone();
            expect(
                validateTildato(
                    dateToISOFormattedDateString(tilDato.toDate()),
                    dateToISOFormattedDateString(fraDato.toDate())
                )
            ).toBeUndefined();
            const date3YearsAgo = moment(tilDato).subtract(3, 'years').toDate();
            expect(validateTildato(dateToISOFormattedDateString(date3YearsAgo))).toBeUndefined();
        });

        it('should return error message if tilDato is weekend', () => {
            const fraDato = dateToISOFormattedDateString(new Date('02.05.2021'));
            const tilDato = dateToISOFormattedDateString(new Date('03.28.2021'));
            expect(validateTildato(tilDato, fraDato)).toEqual(
                createFieldValidationError(AppFieldValidationErrors.er_helg)
            );
        });

        it('should return undefined if tilDato is not weekend', () => {
            const fraDato = dateToISOFormattedDateString(new Date('02.01.2021'));
            const tilDato = dateToISOFormattedDateString(new Date('03.31.2021'));
            expect(validateTildato(tilDato, fraDato)).toBeUndefined();
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
});
