import { YesOrNo } from '../types/YesOrNo';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';
import { isMoreThan3YearsAgo } from '../utils/dateUtils';
import { attachmentHasBeenUploaded } from '../utils/attachmentUtils';
import { FieldValidationResult } from './types';
const moment = require('moment');

export const getFieldValidationIntlKey = (part: string) => `fieldvalidation.${part}`;

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

const fieldIsRequiredError = () => fieldValidationError('påkrevd');

export const validateFødselsnummer = (v: string): FieldValidationResult => {
    const [isValid, reasons] = fødselsnummerIsValid(v);
    if (!isValid) {
        if (reasons.includes(FødselsnummerValidationErrorReason.MustConsistOf11Digits)) {
            return fieldValidationError('fødselsnummer.11siffer');
        } else {
            return fieldValidationError('fødselsnummer.ugyldig');
        }
    }
};

export const validateForeløpigFødselsnummer = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return undefined;
    }

    const elevenDigits = new RegExp('^\\d{11}$');
    if (!elevenDigits.test(v)) {
        return fieldValidationError('foreløpigFødselsnummer.ugyldig');
    }
    return undefined;
};

export const validateValgtBarn = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateNavn = (v: string, isRequired?: boolean): FieldValidationResult => {
    if (isRequired === true && !hasValue(v)) {
        return fieldIsRequiredError();
    }

    const maxNumOfLetters = 50;
    const nameIsValid = v.length <= maxNumOfLetters;

    return nameIsValid ? undefined : fieldValidationError('navn.maksAntallTegn', { maxNumOfLetters });
};

export const validateRelasjonTilBarnet = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return fieldIsRequiredError();
    }

    const maxNumOfLetters = 15;
    const relasjonIsValid = v.length <= maxNumOfLetters;

    return relasjonIsValid ? undefined : fieldValidationError('relasjon.maksAntallTegn', { maxNumOfLetters });
};

export const validateFradato = (fraDato?: Date, tilDato?: Date): FieldValidationResult => {
    if (!hasValue(fraDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(fraDato!)) {
        return fieldValidationError('fradato.merEnnTreÅr');
    }

    if (hasValue(tilDato)) {
        if (moment(fraDato).isAfter(tilDato)) {
            return fieldValidationError('fradato.erEtterTildato');
        }
    }

    return undefined;
};

export const validateTildato = (tilDato?: Date, fraDato?: Date): FieldValidationResult => {
    if (!hasValue(tilDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(tilDato!)) {
        return fieldValidationError('tildato.merEnnTreÅr');
    }

    if (hasValue(fraDato)) {
        if (moment(tilDato).isBefore(fraDato)) {
            return fieldValidationError('tildato.erFørFradato');
        }
    }

    return undefined;
};

export const validateYesOrNoIsAnswered = (answer: YesOrNo): FieldValidationResult => {
    if (answer === YesOrNo.UNANSWERED) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateLegeerklæring = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    if (uploadedAttachments.length === 0) {
        return fieldValidationError('legeerklæring.mangler');
    }
    if (uploadedAttachments.length > 3) {
        return fieldValidationError('legeerklæring.over3bilder');
    }
    return undefined;
};

export const validateGrad = (grad: number | string): FieldValidationResult => {
    if (typeof grad === 'string') {
        const gradNumber = +grad;
        if (Number.isInteger(gradNumber)) {
            if (gradNumber < 20 || gradNumber > 100) {
                return fieldValidationError('grad.ugyldig');
            } else {
                return undefined;
            }
        } else {
            return fieldValidationError('grad.ugyldig');
        }
    } else {
        if (grad < 20 || grad > 100) {
            return fieldValidationError('grad.ugyldig');
        }
    }

    return undefined;
};

const fieldValidationError = (key: string | undefined, values?: any): FieldValidationResult => {
    return key
        ? {
              key: getFieldValidationIntlKey(key),
              values
          }
        : undefined;
};
