import { YesOrNo } from '../types/YesOrNo';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';
import { isMoreThan3YearsAgo } from '../utils/dateUtils';

const moment = require('moment');

export const hasValue = (v: any) => v !== '' && v !== undefined && v !== null;

export const validateFødselsnummer = (v: string): string | undefined => {
    const [isValid, reasons] = fødselsnummerIsValid(v);
    let errorMessage;
    if (!isValid) {
        if (reasons.includes(FødselsnummerValidationErrorReason.MustConsistOf11Digits)) {
            errorMessage = 'Fødselsnummeret må bestå av 11 tall';
        } else {
            errorMessage = 'Fødselsnummeret er ugyldig';
        }
    }
    return errorMessage;
};

export const validateForeløpigFødselsnummer = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return undefined;
    }

    const elevenDigits = new RegExp('^\\d{11}$');
    if (!elevenDigits.test(v)) {
        return 'Det foreløpige fødselsnummeret / D-nummeret må bestå av 11 tall';
    }
    return undefined;
};

export const validateValgtBarn = (v: string): string | undefined => {
    let result;
    if (!hasValue(v)) {
        result = 'Feltet er påkrevd';
    }
    return result;
};

export const validateNavn = (v: string, isRequired?: boolean): string | undefined => {
    if (isRequired === true && !hasValue(v)) {
        return 'Feltet er påkrevd';
    }

    const maxNumOfLetters = 50;
    const nameIsValid = v.length <= maxNumOfLetters;

    return nameIsValid ? undefined : `Navnet kan være maks ${maxNumOfLetters} tegn`;
};

export const validateRelasjonTilBarnet = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return 'Feltet er påkrevd';
    }

    const maxNumOfLetters = 15;
    const relasjonIsValid = v.length <= maxNumOfLetters;

    return relasjonIsValid ? undefined : `Din relasjon til barnet kan maks være beskrevet på ${maxNumOfLetters} tegn`;
};

export const validateFradato = (fraDato?: Date, tilDato?: Date): string | undefined => {
    if (!hasValue(fraDato)) {
        return 'Feltet er påkrevd';
    }

    if (isMoreThan3YearsAgo(fraDato!)) {
        return 'Du kan ikke søke om pleiepenger for en periode som er mer enn tre år tilbake i tid';
    }

    if (hasValue(tilDato)) {
        if (moment(fraDato).isAfter(tilDato)) {
            return 'Fra-datoen kan ikke være senere enn til-datoen';
        }
    }

    return undefined;
};

export const validateTildato = (tilDato?: Date, fraDato?: Date): string | undefined => {
    if (!hasValue(tilDato)) {
        return 'Feltet er påkrevd';
    }

    if (isMoreThan3YearsAgo(tilDato!)) {
        return 'Du kan ikke søke om pleiepenger for en periode som er mer enn tre år tilbake i tid';
    }

    if (hasValue(fraDato)) {
        if (moment(tilDato).isBefore(fraDato)) {
            return 'Til-datoen kan ikke være tidligere enn fra-datoen';
        }
    }

    return undefined;
};

export const validateYesOrNoIsAnswered = (answer: YesOrNo): string | undefined => {
    if (answer === YesOrNo.UNANSWERED) {
        return 'Feltet er påkrevd';
    }
    return undefined;
};

export const validateLegeerklæring = (files: File[]): string | undefined => {
    if (files.length === 0) {
        return 'Du må laste opp en legeerklæring';
    }
    return undefined;
};
