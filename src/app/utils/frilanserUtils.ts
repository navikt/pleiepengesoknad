import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';

export const erFrilanserISøknadsperiode = (periodeFra?: string, frilansSluttdato?: string): boolean => {
    dayjs.extend(isSameOrAfter);
    dayjs.extend(customParseFormat);

    const periodeFraDate = datepickerUtils.getDateFromDateString(periodeFra);
    const frilansSluttdatoDate = datepickerUtils.getDateFromDateString(frilansSluttdato);

    return periodeFraDate && frilansSluttdatoDate
        ? dayjs(frilansSluttdatoDate).isSameOrAfter(periodeFraDate, 'day')
        : false;
};
