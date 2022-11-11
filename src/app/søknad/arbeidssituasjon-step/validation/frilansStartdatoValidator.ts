import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../types/ArbeidsforholdFormValues';
import dayjs from 'dayjs';
import { FrilansFormData } from '../../../types/FrilansFormData';

export const getFrilanserStartdatoValidator =
    (formData: FrilansFormData, søknadsperiode: DateRange, søknadsdato: Date) =>
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

export const getNyFrilanserStartdatoValidator =
    (formData: ArbeidsforholdFrilanserMedOppdragFormValues, søknadsperiode: DateRange, søknadsdato: Date) =>
    (value: string): ValidationResult<ValidationError> => {
        const dateError = getDateValidator({ required: true, max: søknadsdato })(value);
        if (dateError) {
            return dateError;
        }
        const frilansStartdato = formData.arbeidsgiver.ansattFom;
        if (frilansStartdato && dayjs(frilansStartdato).isAfter(søknadsperiode.to, 'day')) {
            return 'startetEtterSøknadsperiode';
        }
        return undefined;
    };
