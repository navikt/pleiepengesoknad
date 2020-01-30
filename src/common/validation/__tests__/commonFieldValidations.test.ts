import {
    validateFødselsnummer,
    CommonFieldValidationErrors,
    fieldValidationError,
    validateYesOrNoIsAnswered
} from '../commonFieldValidations';
import { YesOrNo } from 'common/types/YesOrNo';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from '../fødselsnummerValidator';
import Mock = jest.Mock;

jest.mock('../fødselsnummerValidator', () => {
    return {
        fødselsnummerIsValid: jest.fn(),
        FødselsnummerValidationErrorReason: {
            MustConsistOf11Digits: 'MustConsistOf11Digits'
        }
    };
});

describe('commonFieldValidations', () => {
    const fieldRequiredError = fieldValidationError(CommonFieldValidationErrors.påkrevd);

    describe('validateFødselsnummer', () => {
        const mockedFnr = '1'.repeat(11);

        it('should return an error message specific for fødselsnummer not being 11 digits when reason for validation failure is MustConsistOf11Digits', () => {
            (fødselsnummerIsValid as Mock).mockReturnValue([
                false,
                FødselsnummerValidationErrorReason.MustConsistOf11Digits
            ]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toEqual(fieldValidationError(CommonFieldValidationErrors.fødselsnummer_11siffer));
        });

        it('should return an error message saying fnr format is validation has failed, but reason is not MustConsistOf11Digits', () => {
            (fødselsnummerIsValid as Mock).mockReturnValue([false, []]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toEqual(fieldValidationError(CommonFieldValidationErrors.fødselsnummer_ugyldig));
        });

        it('should return undefined if fødselsnummer is valid', () => {
            (fødselsnummerIsValid as Mock).mockReturnValue([true]);
            const result = validateFødselsnummer(mockedFnr);
            expect(fødselsnummerIsValid).toHaveBeenCalledWith(mockedFnr);
            expect(result).toBeUndefined();
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
            expect(validateYesOrNoIsAnswered(YesOrNo.UNANSWERED)).toEqual(fieldRequiredError);
        });
    });
});
