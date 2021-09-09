import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

export const erFrilanserISøknadsperiode = ({
    frilans_harHattInntektSomFrilanser,
    frilans_jobberFortsattSomFrilans,
    frilans_sluttdato,
    periodeFra,
}: Partial<PleiepengesøknadFormData>): boolean => {
    if (frilans_harHattInntektSomFrilanser !== YesOrNo.YES) {
        return false;
    }
    if (frilans_jobberFortsattSomFrilans === YesOrNo.YES) {
        return true;
    }

    dayjs.extend(isSameOrAfter);
    dayjs.extend(customParseFormat);

    const periodeFraDate = datepickerUtils.getDateFromDateString(periodeFra);
    const frilansSluttdatoDate = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    return periodeFraDate && frilansSluttdatoDate
        ? dayjs(frilansSluttdatoDate).isSameOrAfter(periodeFraDate, 'day')
        : false;
};
