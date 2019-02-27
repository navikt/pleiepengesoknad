const fnrvalidator = require('@navikt/fnrvalidator');

export enum FødselsnummerValidationErrorReason {
    MustConsistOf11Digits = 'fnr must consist of 11 digits',
    InvalidDate = 'invalid date',
    ChecksumsDontMatch = "checksums don't match"
}

interface FnrValidationResult {
    reasons?: FødselsnummerValidationErrorReason[];
    status: 'valid' | 'invalid';
}

export const fødselsnummerIsValid = (value: string): [boolean, FødselsnummerValidationErrorReason[]] => {
    const { status, reasons }: FnrValidationResult = fnrvalidator.fnr(value);
    if (status === 'valid') {
        return [true, []];
    } else {
        return [false, reasons!];
    }
};
