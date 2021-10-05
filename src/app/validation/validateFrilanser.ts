import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { AppFormField, PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { getDateValidator } from '@navikt/sif-common-formik/lib/validation';

dayjs.extend(isSameOrAfter);

type FrilansFormDataForValidation = Pick<
    PleiepengesøknadFormData,
    | AppFormField.frilans_harHattInntektSomFrilanser
    | AppFormField.frilans_jobberFortsattSomFrilans
    | AppFormField.frilans_sluttdato
    | AppFormField.frilans_startdato
    | AppFormField.periodeFra
    | AppFormField.periodeTil
>;

export const getFrilanserStartdatoValidator =
    (formData: FrilansFormDataForValidation) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({ required: true, max: dateToday })(value);
        if (dateError) {
            return dateError;
        }
        const periodeTilDato = datepickerUtils.getDateFromDateString(formData.periodeTil);
        const frilansStartdato = datepickerUtils.getDateFromDateString(formData.frilans_startdato);
        if (periodeTilDato && frilansStartdato && dayjs(frilansStartdato).isAfter(periodeTilDato)) {
            return 'startetEtterSøknadsperiode';
        }
        return undefined;
    };

export const getFrilanserSluttdatoValidator =
    (formData: FrilansFormDataForValidation) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({
            required: true,
            min: datepickerUtils.getDateFromDateString(formData.frilans_startdato),
            max: dateToday,
        })(value);
        if (dateError) {
            return dateError;
        }
        const periodeFraDato = datepickerUtils.getDateFromDateString(formData.periodeFra);
        const frilansSluttdato = datepickerUtils.getDateFromDateString(formData.frilans_sluttdato);
        if (periodeFraDato && frilansSluttdato && dayjs(frilansSluttdato).isBefore(periodeFraDato)) {
            return 'sluttetFørSøknadsperiode';
        }

        return undefined;
    };

export const erFrilanserISøknadsperiode = ({
    frilans_harHattInntektSomFrilanser,
    frilans_jobberFortsattSomFrilans,
    frilans_sluttdato,
    periodeFra,
}: FrilansFormDataForValidation): boolean => {
    if (frilans_harHattInntektSomFrilanser !== YesOrNo.YES) {
        return false;
    }
    if (frilans_jobberFortsattSomFrilans === YesOrNo.YES) {
        return true;
    }

    const periodeFraDate = datepickerUtils.getDateFromDateString(periodeFra);
    const frilansSluttdatoDate = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    return periodeFraDate && frilansSluttdatoDate
        ? dayjs(frilansSluttdatoDate).isSameOrAfter(periodeFraDate, 'day')
        : false;
};
