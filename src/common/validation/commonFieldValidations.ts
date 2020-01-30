import { FieldValidationResult } from './types';
import { hasValue } from './hasValue';
import { YesOrNo } from 'common/types/YesOrNo';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';

export enum CommonFieldValidationErrors {
    'påkrevd' = 'common.fieldvalidation.isRequired',
    'fødselsnummer_11siffer' = 'common.fieldvalidation.fødselsnummer.11siffer',
    'fødselsnummer_ugyldig' = 'common.fieldvalidation.fødselsnummer.ugyldig'
}

export const fieldIsRequiredError = () => fieldValidationError(CommonFieldValidationErrors.påkrevd);

export const fieldValidationError = <T extends string>(
    key: T | CommonFieldValidationErrors | undefined,
    values?: any
): FieldValidationResult => {
    return key
        ? {
              key,
              values
          }
        : undefined;
};
export const validateRequiredField = (value: any): FieldValidationResult => {
    if (!hasValue(value)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateFødselsnummer = (v: string): FieldValidationResult => {
    const [isValid, reasons] = fødselsnummerIsValid(v);
    if (!isValid) {
        if (reasons.includes(FødselsnummerValidationErrorReason.MustConsistOf11Digits)) {
            return fieldValidationError(CommonFieldValidationErrors.fødselsnummer_11siffer);
        } else {
            return fieldValidationError(CommonFieldValidationErrors.fødselsnummer_ugyldig);
        }
    }
};

export const validateRequiredSelect = (value: any): FieldValidationResult => {
    if (!hasValue(value)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateYesOrNoIsAnswered = (answer: YesOrNo): FieldValidationResult => {
    if (answer === YesOrNo.UNANSWERED || answer === undefined) {
        return fieldIsRequiredError();
    }
    return undefined;
};
