import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { YesOrNo } from 'common/types/YesOrNo';
import { validateFødselsnummer } from 'common/validation/fieldValidations';
import { validateNavn, validateValgtBarn } from './fieldValidations';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: PleiepengesøknadFormData) =>
    harForståttRettigheterOgPlikter === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetHarIkkeFåttFødselsnummerEnda,
    barnetSøknadenGjelder
}: PleiepengesøknadFormData) => {
    const formIsValid =
        validateNavn(barnetsNavn) === undefined && barnetHarIkkeFåttFødselsnummerEnda
            ? true
            : validateFødselsnummer(barnetsFødselsnummer) === undefined;

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return validateValgtBarn(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: PleiepengesøknadFormData) => {
    return periodeFra !== undefined && periodeTil !== undefined;
};

export const arbeidsforholdStepIsValid = () => true;

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd
}: PleiepengesøknadFormData) =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = () => true;
