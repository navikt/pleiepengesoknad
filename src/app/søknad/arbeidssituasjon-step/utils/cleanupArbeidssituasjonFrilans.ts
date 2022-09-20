import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from '../../../types';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { extractArbeidFrilansSøknadsdata } from '../../../utils/formValuesToSøknadsdata/extractArbeidFrilansSøknadsdata';
import { getArbeidFrilansFormValues } from '../../../utils/søknadsdataToFormValues/getArbeidFrilansFromSøknadsdata';

export const cleanupArbeidssituasjonFrilans = (
    søknadsperiode: DateRange,
    values: FrilansFormData,
    frilansoppdrag: Arbeidsgiver[] | undefined = []
): FrilansFormData => {
    const søknadsdata = extractArbeidFrilansSøknadsdata(values, frilansoppdrag, søknadsperiode);
    if (søknadsdata) {
        return getArbeidFrilansFormValues(søknadsdata, frilansoppdrag);
    }
    return values;
};
