import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import * as fieldValidations from './fieldValidations';
import { YesOrNo } from '../types/YesOrNo';

export const welcomingPageIsValid = ({ harGodkjentVilkår }: PleiepengesøknadFormData) => harGodkjentVilkår === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetHarIkkeFåttFødselsnummerEnda,
    søkersRelasjonTilBarnet
}: PleiepengesøknadFormData) => {
    if (barnetHarIkkeFåttFødselsnummerEnda) {
        return fieldValidations.validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined;
    }

    return (
        fieldValidations.validateNavn(barnetsNavn) === undefined &&
        fieldValidations.validateFødselsnummer(barnetsFødselsnummer) === undefined &&
        fieldValidations.validateRelasjonTilBarnet(søkersRelasjonTilBarnet) === undefined
    );
};

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: PleiepengesøknadFormData) => {
    return periodeFra !== undefined && periodeTil !== undefined;
};

export const opplysningerOmAnsettelsesforholdStepIsValid = () => true;

export const medlemsskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: PleiepengesøknadFormData) =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = () => true;
