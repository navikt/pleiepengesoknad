import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { validateFødselsnummer, validateNavn, validateRelasjonTilBarnet } from './fieldValidations';

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
        validateFødselsnummer(barnetsFødselsnummer) === undefined &&
        validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined
    );
};

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: PleiepengesøknadFormData) => {
    return periodeFra !== undefined && periodeTil !== undefined;
};

export const opplysningerOmAnsettelsesforholdStepIsValid = () => true;

export const legeerklæringStepIsValid = () => true;
