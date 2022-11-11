import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../types/ArbeidsforholdFormValues';
import dayjs from 'dayjs';

export const getNyFrilanserSluttdatoValidator =
    (
        formData: ArbeidsforholdFrilanserMedOppdragFormValues,
        søknadsperiode: DateRange,
        søknadsdato: Date
        //TODO
        //harFrilansoppdrag: boolean
    ) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({
            required: true,
            min: formData.arbeidsgiver.ansattFom,
            max: søknadsdato,
        })(value);
        if (dateError) {
            return dateError;
        }

        const frilansSluttdato = formData.arbeidsgiver.ansattTom;
        if (frilansSluttdato && dayjs(frilansSluttdato).isBefore(søknadsperiode.from, 'day')) {
            return 'sluttetFørSøknadsperiode';
        }

        return undefined;
    };

export const getFrilansOppdragSluttdatoValidator =
    (formData: ArbeidsforholdFrilanserMedOppdragFormValues, søknadsperiode: DateRange, søknadsdato: Date) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({
            required: true,
            min: formData.arbeidsgiver.ansattFom,
            max: søknadsdato,
        })(value);
        if (dateError) {
            return dateError;
        }

        const frilansSluttdato = datepickerUtils.getDateFromDateString(formData.sluttdato);
        if (frilansSluttdato && dayjs(frilansSluttdato).isBefore(søknadsperiode.from, 'day')) {
            return 'sluttetFørSøknadsperiode';
        }

        return undefined;
    };
