import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FrilansFormDataPart } from './../types/SøknadFormData';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';

export const getFrilanserStartdatoValidator =
    (formData: FrilansFormDataPart, søknadsperiode: DateRange, søknadsdato: Date) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({ required: true, max: søknadsdato })(value);
        if (dateError) {
            return dateError;
        }
        const frilansStartdato = datepickerUtils.getDateFromDateString(formData.startdato);
        if (frilansStartdato && dayjs(frilansStartdato).isAfter(søknadsperiode.to, 'day')) {
            return 'startetEtterSøknadsperiode';
        }
        return undefined;
    };

export const getFrilanserSluttdatoValidator =
    (formData: FrilansFormDataPart, søknadsperiode: DateRange, søknadsdato: Date, harFrilansoppdrag: boolean) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({
            required: true,
            min: datepickerUtils.getDateFromDateString(formData.startdato),
            max: søknadsdato,
        })(value);
        if (dateError) {
            return dateError;
        }
        /** Sjekk kun på om sluttdato er før søknadsperiode dersom bruker ikke har frilansoppdrag. */
        if (harFrilansoppdrag === false) {
            const frilansSluttdato = datepickerUtils.getDateFromDateString(formData.sluttdato);
            if (frilansSluttdato && dayjs(frilansSluttdato).isBefore(søknadsperiode.from, 'day')) {
                return 'sluttetFørSøknadsperiode';
            }
        }

        return undefined;
    };
