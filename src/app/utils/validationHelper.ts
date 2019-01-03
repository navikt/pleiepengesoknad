export const hasValue = (v: string) => v !== '' && v !== undefined && v !== null && v.length > 0;

export const validateFnr = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return 'Feltet er påkrevd';
    }

    const fnrIsValid = v.length === 11;

    let result;
    if (!fnrIsValid) {
        result = 'Fødselsnummeret er ugyldig';
    }
    return result;
};

export const validateNavn = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return 'Feltet er påkrevd';
    }

    const nameIsValid = v.length <= 15;

    let result;
    if (!nameIsValid) {
        result = 'Navnet kan være maks 15 tegn';
    }
    return result;
};

export const validateRelasjonTilBarnet = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return 'Feltet er påkrevd';
    }

    const relasjonIsValid = v.length <= 15;

    let result;
    if (!relasjonIsValid) {
        result = 'Din relasjon til barnet kan maks være beskrevet på 15 tegn';
    }
    return result;
};

export const validateAdresse = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return 'Feltet er påkrevd';
    }

    const adrIsValid = v.length <= 30;

    let result;
    if (!adrIsValid) {
        result = 'Adressen kan maks være 30 tegn';
    }
    return result;
};
