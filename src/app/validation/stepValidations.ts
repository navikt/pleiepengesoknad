import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import {
    getDateValidator,
    getFødselsnummerValidator,
    getStringValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { validateNavn } from './fieldValidations';

export const welcomingPageIsValid = ({ harForståttRettigheterOgPlikter }: PleiepengesøknadFormData) =>
    harForståttRettigheterOgPlikter === true;

export const opplysningerOmBarnetStepIsValid = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetsFødselsdato,
    barnetHarIkkeFåttFødselsnummerEnda,
    barnetSøknadenGjelder,
}: PleiepengesøknadFormData) => {
    if (barnetHarIkkeFåttFødselsnummerEnda) {
        return getDateValidator({ required: true })(barnetsFødselsdato);
    }
    const formIsValid =
        validateNavn(barnetsNavn) === undefined &&
        getFødselsnummerValidator({ required: true })(barnetsFødselsnummer) === undefined;

    if (!formIsValid && barnetSøknadenGjelder !== undefined) {
        return getStringValidator({ required: true })(barnetSøknadenGjelder) === undefined;
    }

    return formIsValid;
};

export const opplysningerOmTidsromStepIsValid = ({ periodeFra, periodeTil }: PleiepengesøknadFormData) => {
    return periodeFra !== undefined && periodeTil !== undefined;
};

export const arbeidsforholdStepIsValid = () => true;

export const medlemskapStepIsValid = ({
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
}: PleiepengesøknadFormData) =>
    (harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES || harBoddUtenforNorgeSiste12Mnd === YesOrNo.NO) &&
    (skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES || skalBoUtenforNorgeNeste12Mnd === YesOrNo.NO);

export const legeerklæringStepIsValid = () => true;
