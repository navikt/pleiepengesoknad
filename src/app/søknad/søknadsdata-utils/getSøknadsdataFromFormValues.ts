import { SøknadFormData } from '../../types/SøknadFormData';
import { Søknadsdata } from '../../types/Søknadsdata';
import { getSøknadsperiodeFromFormData } from '../../utils/formDataUtils';
import { extractArbeidssituasjonSøknadsdata } from './extractArbeidssituasjonSøknadsdata';

export const getSøknadsdataFromFormValues = (values: SøknadFormData): Søknadsdata => {
    const søknadsperiode = getSøknadsperiodeFromFormData(values);
    if (søknadsperiode === undefined) {
        return {};
    }
    const søknadsdata: Søknadsdata = {
        periode: {
            søknadsperiode,
        },
        arbeidssituasjon: extractArbeidssituasjonSøknadsdata(values, søknadsperiode),
    };
    return søknadsdata;
};
