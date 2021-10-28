import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { AppFormField, PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

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
    (formData: FrilansFormDataForValidation, søknadsdato: Date) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({ required: true, max: søknadsdato })(value);
        if (dateError) {
            return dateError;
        }
        const periodeTilDato = datepickerUtils.getDateFromDateString(formData.periodeTil);
        const frilansStartdato = datepickerUtils.getDateFromDateString(formData.frilans_startdato);
        if (periodeTilDato && frilansStartdato && dayjs(frilansStartdato).isAfter(periodeTilDato, 'day')) {
            return 'startetEtterSøknadsperiode';
        }
        return undefined;
    };

export const getFrilanserSluttdatoValidator =
    (formData: FrilansFormDataForValidation, søknadsdato: Date) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({
            required: true,
            min: datepickerUtils.getDateFromDateString(formData.frilans_startdato),
            max: søknadsdato,
        })(value);
        if (dateError) {
            return dateError;
        }
        const periodeFraDato = datepickerUtils.getDateFromDateString(formData.periodeFra);
        const frilansSluttdato = datepickerUtils.getDateFromDateString(formData.frilans_sluttdato);
        if (periodeFraDato && frilansSluttdato && dayjs(frilansSluttdato).isBefore(periodeFraDato, 'day')) {
            return 'sluttetFørSøknadsperiode';
        }

        return undefined;
    };
