import { SøknadFormData } from '../../types/SøknadFormData';
import { Søknadsdata } from '../../types/Søknadsdata';
import { getSøknadsperiodeFromFormData } from '../formDataUtils';
import { extractArbeidSøknadsdata } from './extractArbeidSøknadsdata';

export const getSøknadsdataFromFormValues = (values: SøknadFormData): Søknadsdata => {
    const søknadsperiode = getSøknadsperiodeFromFormData(values);
    if (søknadsperiode === undefined) {
        return {};
    }
    const søknadsdata: Søknadsdata = {
        søknadsperiode,
        arbeid: extractArbeidSøknadsdata(values, søknadsperiode),
    };
    console.log(søknadsdata);
    return søknadsdata;
};
