import { DateRange } from '@navikt/sif-common-formik/lib';
import { getDateValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidsforholdFrilansoppdragFormValues } from '../../../types/ArbeidsforholdFormValues';
import dayjs from 'dayjs';

export const getNyFrilanserStartdatoValidator =
    (formData: ArbeidsforholdFrilansoppdragFormValues, søknadsperiode: DateRange, søknadsdato: Date) =>
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
