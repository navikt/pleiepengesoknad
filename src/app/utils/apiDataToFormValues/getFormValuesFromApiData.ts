import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormValues } from '../../types/SøknadFormValues';

export const getApiDataFromSøknadsdata = (søknad: SøknadApiData | undefined): Partial<SøknadFormValues> | undefined => {
    if (!søknad) return undefined;
    const formValues: Partial<SøknadFormValues> = {
        harForståttRettigheterOgPlikter: søknad.harForståttRettigheterOgPlikter,
        harBekreftetOpplysninger: false,
    };
    return formValues;
};
