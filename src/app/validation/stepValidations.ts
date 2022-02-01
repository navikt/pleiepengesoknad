import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { getStringValidator } from '@navikt/sif-common-formik/lib/validation';
import { SøknadFormData } from '../types/SøknadFormData';
import { validateFødselsnummer, validateNavn } from './fieldValidations';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormData) =>
    harForståttRettigheterOgPlikter === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetsFødselsdato,
    barnetHarIkkeFnr,
    årsakManglerIdentitetsnummer,
    barnetSøknadenGjelder,
}: SøknadFormData) => {
    const fødselsnummerValidation = () => {
        if (barnetHarIkkeFnr && barnetsFødselsdato !== undefined && årsakManglerIdentitetsnummer !== undefined) {
            return true;
        } else return validateFødselsnummer(barnetsFødselsnummer) === undefined;
    };
    const formIsValid = validateNavn(barnetsNavn) === undefined && fødselsnummerValidation();

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return getStringValidator({ required: true })(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: SøknadFormData) => {
    return periodeFra !== undefined && periodeTil !== undefined;
};

export const arbeidssituasjonStepIsValid = () => true;

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: SøknadFormData) =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = () => true;
