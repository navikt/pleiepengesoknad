import { YesOrNo } from '../types/YesOrNo';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';
import { isMoreThan3YearsAgo } from '../utils/dateUtils';
import { attachmentHasBeenUploaded } from '../utils/attachmentUtils';
import { FieldValidationResult } from './types';
import { Time } from 'app/components/time-input-base/TimeInputBase';
import { getDecimalTimeFromTime } from 'app/utils/timeUtils';

const moment = require('moment');

export enum FieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fødselsnummer_11siffer' = 'fieldvalidation.fødselsnummer.11siffer',
    'fødselsnummer_ugyldig' = 'fieldvalidation.fødselsnummer.ugyldig',
    'foreløpigFødselsnummer_ugyldig' = 'fieldvalidation.foreløpigFødselsnummer.ugyldig',
    'navn_maksAntallTegn' = 'fieldvalidation.navn.maksAntallTegn',
    'relasjon_maksAntallTegn' = 'fieldvalidation.relasjon.maksAntallTegn',
    'fradato_merEnnTreÅr' = 'fieldvalidation.fradato.merEnnTreÅr',
    'fradato_erEtterTildato' = 'fieldvalidation.fradato.erEtterTildato',
    'tildato_merEnnTreÅr' = 'fieldvalidation.tildato.merEnnTreÅr',
    'tildato_erFørFradato' = 'fieldvalidation.tildato.erFørFradato',
    'legeerklæring_mangler' = 'fieldvalidation.legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'fieldvalidation.legeerklæring.forMangeFiler',
    'grad_ugyldig' = 'fieldvalidation.grad.ugyldig',
    'ansettelsesforhold_timerUgyldig' = 'fieldvalidation.ansettelsesforhold_timerUgyldig',
    'ansettelsesforhold_prosentUgyldig' = 'fieldvalidation.ansettelsesforhold_prosentUgyldig',
    'ansettelsesforhold_redusertMerEnnNormalt' = 'fieldvalidation.ansettelsesforhold_redusertMerEnnNormalt'
}

const MAX_ARBEIDSTIMER_PER_UKE = 150;
const MIN_ARBEIDSTIMER_PER_UKE = 1;

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

const fieldIsRequiredError = () => fieldValidationError(FieldValidationErrors.påkrevd);

export const validateFødselsnummer = (v: string): FieldValidationResult => {
    const [isValid, reasons] = fødselsnummerIsValid(v);
    if (!isValid) {
        if (reasons.includes(FødselsnummerValidationErrorReason.MustConsistOf11Digits)) {
            return fieldValidationError(FieldValidationErrors.fødselsnummer_11siffer);
        } else {
            return fieldValidationError(FieldValidationErrors.fødselsnummer_ugyldig);
        }
    }
};

export const validateForeløpigFødselsnummer = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return undefined;
    }

    const elevenDigits = new RegExp('^\\d{11}$');
    if (!elevenDigits.test(v)) {
        return fieldValidationError(FieldValidationErrors.foreløpigFødselsnummer_ugyldig);
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

    return nameIsValid
        ? undefined
        : fieldValidationError(FieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters });
};

export const validateRelasjonTilBarnet = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return fieldIsRequiredError();
    }

    const maxNumOfLetters = 15;
    const relasjonIsValid = v.length <= maxNumOfLetters;

    return relasjonIsValid
        ? undefined
        : fieldValidationError(FieldValidationErrors.relasjon_maksAntallTegn, { maxNumOfLetters });
};

export const validateFradato = (fraDato?: Date, tilDato?: Date): FieldValidationResult => {
    if (!hasValue(fraDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(fraDato!)) {
        return fieldValidationError(FieldValidationErrors.fradato_merEnnTreÅr);
    }

    if (hasValue(tilDato)) {
        if (moment(fraDato).isAfter(tilDato)) {
            return fieldValidationError(FieldValidationErrors.fradato_erEtterTildato);
        }
    }

    return undefined;
};

export const validateTildato = (tilDato?: Date, fraDato?: Date): FieldValidationResult => {
    if (!hasValue(tilDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(tilDato!)) {
        return fieldValidationError(FieldValidationErrors.tildato_merEnnTreÅr);
    }

    if (hasValue(fraDato)) {
        if (moment(tilDato).isBefore(fraDato)) {
            return fieldValidationError(FieldValidationErrors.tildato_erFørFradato);
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
        return fieldValidationError(FieldValidationErrors.legeerklæring_mangler);
    }
    if (uploadedAttachments.length > 3) {
        return fieldValidationError(FieldValidationErrors.legeerklæring_forMangeFiler);
    }
    return undefined;
};

export const validateGrad = (grad: number | string): FieldValidationResult => {
    if (typeof grad === 'string') {
        const gradNumber = +grad;
        if (Number.isInteger(gradNumber)) {
            if (gradNumber < 20 || gradNumber > 100) {
                return fieldValidationError(FieldValidationErrors.grad_ugyldig);
            } else {
                return undefined;
            }
        } else {
            return fieldValidationError(FieldValidationErrors.grad_ugyldig);
        }
    } else {
        if (grad < 20 || grad > 100) {
            return fieldValidationError(FieldValidationErrors.grad_ugyldig);
        }
    }

    return undefined;
};

export const validateRequiredField = (value: any): FieldValidationResult => {
    if (!hasValue(value)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateNormaleArbeidstimer = (time: Time | undefined, isRequired?: boolean): FieldValidationResult => {
    if (isRequired && time === undefined) {
        return fieldIsRequiredError();
    }
    if (time && (time.hours < MIN_ARBEIDSTIMER_PER_UKE || time.hours > MAX_ARBEIDSTIMER_PER_UKE)) {
        return fieldValidationError(FieldValidationErrors.ansettelsesforhold_timerUgyldig, {
            min: MIN_ARBEIDSTIMER_PER_UKE,
            max: MAX_ARBEIDSTIMER_PER_UKE
        });
    }
    return undefined;
};

export const validateReduserteArbeidTimer = (
    value: number | string,
    normalTimer: Time | undefined,
    isRequired?: boolean
): FieldValidationResult => {
    if (isRequired && !hasValue(value)) {
        return fieldIsRequiredError();
    }
    const timer = typeof value === 'string' ? parseFloat(value) : value;

    if (normalTimer === undefined) {
        return validateNormaleArbeidstimer({ hours: timer, minutes: 0 });
    }

    if (timer < MIN_ARBEIDSTIMER_PER_UKE || timer > MAX_ARBEIDSTIMER_PER_UKE) {
        return fieldValidationError(FieldValidationErrors.ansettelsesforhold_timerUgyldig, {
            min: MIN_ARBEIDSTIMER_PER_UKE,
            max: Math.max(MAX_ARBEIDSTIMER_PER_UKE, getDecimalTimeFromTime(normalTimer))
        });
    }
    if (timer > (getDecimalTimeFromTime(normalTimer) || MAX_ARBEIDSTIMER_PER_UKE)) {
        return fieldValidationError(FieldValidationErrors.ansettelsesforhold_redusertMerEnnNormalt);
    }
    return undefined;
};
export const validateReduserteArbeidProsent = (value: number | string, isRequired?: boolean): FieldValidationResult => {
    if (isRequired && !hasValue(value)) {
        return fieldIsRequiredError();
    }
    const prosent = typeof value === 'string' ? parseFloat(value) : value;

    if (prosent < 1 || prosent > 100) {
        return fieldValidationError(FieldValidationErrors.ansettelsesforhold_prosentUgyldig);
    }
    return undefined;
};

export const fieldValidationError = (key: FieldValidationErrors | undefined, values?: any): FieldValidationResult => {
    return key
        ? {
              key,
              values
          }
        : undefined;
};
