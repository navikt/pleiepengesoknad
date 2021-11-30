import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { SøknadFormData } from '../types/SøknadFormData';

export const getSøknadsperiodeFromFormData = ({
    periodeFra,
    periodeTil,
}: Partial<SøknadFormData>): DateRange | undefined => {
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
