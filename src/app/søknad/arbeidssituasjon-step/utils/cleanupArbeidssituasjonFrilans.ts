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
            /** Fjern arbeid i perioden når bruker har gått tilbake til situasjonssteget og endret
             * svar etter å ha oppgitt arbeidstid
             */
            values.arbeidsforhold.arbeidIPeriode = undefined;
        }
    }
    return values;
};
