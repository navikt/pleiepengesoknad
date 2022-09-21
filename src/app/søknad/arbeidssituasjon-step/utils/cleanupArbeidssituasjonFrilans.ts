import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from '../../../types';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { extractArbeidFrilansSøknadsdata } from '../../../utils/formValuesToSøknadsdata/extractArbeidFrilansSøknadsdata';

export const cleanupArbeidssituasjonFrilans = (
    søknadsperiode: DateRange,
    values: FrilansFormData,
    frilansoppdrag: Arbeidsgiver[] | undefined = []
): FrilansFormData => {
    const søknadsdata = extractArbeidFrilansSøknadsdata(values, frilansoppdrag, søknadsperiode);
    if (søknadsdata) {
        if (
            søknadsdata.erFrilanser &&
            søknadsdata.mottarFosterhjemsgodtgjørelse &&
            søknadsdata.harAndreOppdragEnnFosterhjemsgodtgjørelse === false &&
            values.arbeidsforhold
        ) {
            values.arbeidsforhold.arbeidIPeriode = undefined;
        }
    }
    return values;
};
