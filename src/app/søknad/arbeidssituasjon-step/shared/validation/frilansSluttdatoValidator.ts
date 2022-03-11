import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { FrilansFormData } from '../../../../types/FrilansFormData';

export const getFrilanserSluttdatoValidator =
    (formData: FrilansFormData, søknadsperiode: DateRange, søknadsdato: Date, harFrilansoppdrag: boolean) =>
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
