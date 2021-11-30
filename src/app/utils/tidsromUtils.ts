import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import { SøknadFormData } from '../types/SøknadFormData';
import { Søkerdata } from '../types/Søkerdata';

export const søkerHarBarn = (søkerdata: Søkerdata) => {
    return søkerdata.barn && søkerdata.barn.length > 0;
};

export const søkerHarValgtRegistrertBarn = (values: Partial<SøknadFormData>): boolean => {
    return hasValue(values.barnetSøknadenGjelder) && values.søknadenGjelderEtAnnetBarn !== true;
};
