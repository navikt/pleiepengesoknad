import { RegistrerteBarn } from '../../types';
import { initialValues, SøknadFormValues } from '../../types/SøknadFormValues';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { extractBarnFormValues } from './extractBarnFormValues';
import { extractTidsromFormValues } from './extractTidsromFormValues';

export const getFormValuesFromInnsendtSøknad = (
    søknad: InnsendtSøknadInnhold,
    registrerteBarn: RegistrerteBarn[]
): SøknadFormValues | undefined => {
    if (registrerteBarn.length === 0) {
        return undefined;
    }
    const barnFormValues = extractBarnFormValues(søknad.barn, registrerteBarn);
    if (!barnFormValues) {
        return undefined;
    }
    console.log(barnFormValues);

    const tidsromFormValues = extractTidsromFormValues(søknad);

    const formValues: SøknadFormValues = {
        ...initialValues,
        harForståttRettigheterOgPlikter: true,
        harBekreftetOpplysninger: false,
        ...barnFormValues,
        ...tidsromFormValues,
    };
    return formValues;
};
