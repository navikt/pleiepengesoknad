import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

export const welcomingPageIsValid = ({ harGodkjentVilkår }: PleiepengesøknadFormData) => harGodkjentVilkår === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetHarIkkeFåttFødselsnummerEnda,
    søkersRelasjonTilBarnet
}: PleiepengesøknadFormData) => {
    if (barnetHarIkkeFåttFødselsnummerEnda) {
        return validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined;
    }
    return (
        validateNavn(barnetsNavn) === undefined &&
        validateFnr(barnetsFødselsnummer) === undefined &&
        validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined
    );
};

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: PleiepengesøknadFormData) => {
    return periodeFra !== undefined && periodeTil !== undefined;
};

export const opplysningerOmAnsettelsesforholdStepIsValid = () => true;

export const legeerklæringStepIsValid = () => true;

export const hasValue = (v: string) => v !== '' && v !== undefined && v !== null;

export const validateValgtBarn = (v: string): string | undefined => {
    let result;
    if (!hasValue(v)) {
        result = 'Feltet er påkrevd';
    }
    return result;
};

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

export const validateFradato = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return 'Feltet er påkrevd';
    }
    return undefined;
};

export const validateTildato = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return 'Feltet er påkrevd';
    }
    return undefined;
};
