import { RegistrerteBarn } from '../../types';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { extractBarnFormValues } from './extractBarnFormValues';
import { extractTidsromFormValues } from './extractTidsromFormValues';

export const getFormValuesFromApiData = (
    søknad: SøknadApiData,
    registrerteBarn: RegistrerteBarn[]
): Partial<SøknadFormValues> | undefined => {
    if (registrerteBarn.length === 0) {
        return undefined;
    }

    const barnFormValues = extractBarnFormValues(søknad.barn, registrerteBarn);
    if (!barnFormValues) {
        return undefined;
    }

    const tidsromFormValues = extractTidsromFormValues(søknad);

    const formValues: Partial<SøknadFormValues> = {
        harForståttRettigheterOgPlikter: true,
        harBekreftetOpplysninger: false,
        ...barnFormValues,
        ...tidsromFormValues,
    };

    return formValues;
};
