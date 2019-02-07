import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import fødselsnummerIsValid, { FødselsnummerValidationErrorReason } from './fødselsnummerValidator';

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

export const validateNavn = (v: string): string | undefined => {
    if (!hasValue(v)) {
        return 'Feltet er påkrevd';
    }

    const maxNumOfLetters = 40;
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
