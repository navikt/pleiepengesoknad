import { RegistrerteBarn } from '../../types';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { extractBarnFormValues } from './extractBarnFormValues';
import { extractTidsromFormValues } from './extractTidsromFormValues';

export const getFormValuesFromApiData = (
    søknad: InnsendtSøknadInnhold,
    registrerteBarn: RegistrerteBarn[]
): Partial<SøknadFormValues> | undefined => {
    if (registrerteBarn.length === 0) {
        return undefined;
    }
    try {
        const barnFormValues = extractBarnFormValues(søknad.barn, registrerteBarn);
        const tidsromFormValues = extractTidsromFormValues(søknad);
        const formValues: Partial<SøknadFormValues> = {
            harForståttRettigheterOgPlikter: true,
            harBekreftetOpplysninger: false,
            ...barnFormValues,
            ...tidsromFormValues,
        };

        return formValues;
    } catch (error) {
        return undefined;
    }
};
