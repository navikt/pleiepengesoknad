import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';

export const getApiDataFromSøknadsdata = (søknad: SøknadApiData | undefined): Partial<SøknadFormData> | undefined => {
    if (!søknad) return undefined;
    const formValues: Partial<SøknadFormData> = {
        harForståttRettigheterOgPlikter: søknad.harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger: false,
    };
    return formValues;
};
