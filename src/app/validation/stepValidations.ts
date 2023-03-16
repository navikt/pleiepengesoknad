import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { getStringValidator } from '@navikt/sif-common-formik/lib/validation';
import { SøknadFormValues } from '../types/SøknadFormValues';
import { validateFødselsnummer, validateNavn, validateFradato, validateTildato } from './fieldValidations';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: SøknadFormValues) =>
    harForståttRettigheterOgPlikter === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetsFødselsdato,
    barnetHarIkkeFnr,
    årsakManglerIdentitetsnummer,
    barnetSøknadenGjelder,
    søknadenGjelderEtAnnetBarn,
}: SøknadFormValues) => {
    const fødselsnummerValidation = () => {
        if (barnetHarIkkeFnr && barnetsFødselsdato !== undefined && årsakManglerIdentitetsnummer !== undefined) {
            return true;
        } else return validateFødselsnummer(barnetsFødselsnummer) === undefined;
    };
    const formIsValid = validateNavn(barnetsNavn) === undefined && fødselsnummerValidation();

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return getStringValidator({ required: true })(barnetSøknadenGjelder) === undefined;
    }

    if (barnetSøknadenGjelder === undefined && søknadenGjelderEtAnnetBarn === false) {
        return false;
    }

    return formIsValid;
};

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: Partial<SøknadFormValues>) => {
    return (
        periodeFra !== undefined &&
        periodeTil !== undefined &&
        validateFradato(periodeFra, periodeTil) === undefined &&
        validateTildato(periodeTil, periodeFra) === undefined
    );
};

export const arbeidssituasjonStepIsValid = () => true;

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: SøknadFormValues) =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = () => true;
