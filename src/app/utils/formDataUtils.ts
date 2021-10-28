import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

export const getSøknadsperiodeFromFormData = ({
    periodeFra,
    periodeTil,
}: Partial<PleiepengesøknadFormData>): DateRange | undefined => {
    const fraDato = datepickerUtils.getDateFromDateString(periodeFra);
    const tilDato = datepickerUtils.getDateFromDateString(periodeTil);
    if (fraDato && tilDato) {
        return {
            from: fraDato,
            to: tilDato,
        };
    }
    return undefined;
};
