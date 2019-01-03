const fnrvalidator = require('@navikt/fnrvalidator');

export const validateFnr = (v: string): string | undefined => {
    const fnrIsValid = fnrvalidator.fnr(v).status === 'valid';
    const dnrIsValid = fnrvalidator.dnr(v).status === 'valid';

    let result;
    if (!fnrIsValid && !dnrIsValid) {
        result = 'Fødselsnummeret er ugyldig';
    }
    return result;
};

export const validateNavn = (v: string): string | undefined => {
    const nameIsValid = v.length <= 15;

    let result;
    if (!nameIsValid) {
        result = 'Navnet kan være maks 15 tegn';
    }
    return result;
};

export const validateRelasjonTilBarnet = (v: string): string | undefined => {
    const relasjonIsValid = v.length <= 15;

    let result;
    if (!relasjonIsValid) {
        result = 'Din relasjon til barnet kan maks være beskrevet på 15 tegn';
    }
    return result;
};

export const validateAdresse = (v: string): string | undefined => {
    const adrIsValid = v.length <= 30;

    let result;
    if (!adrIsValid) {
        result = 'Adressen kan maks være 30 tegn';
    }
    return result;
};
