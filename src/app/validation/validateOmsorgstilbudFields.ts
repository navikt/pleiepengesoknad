import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { durationToDecimalDuration, summarizeDurationInDurationWeekdays } from '@navikt/sif-common-utils';
import { OmsorgstilbudSvar } from '../types/søknad-api-data/SøknadApiData';
import { OmsorgstilbudFormData } from '../types/SøknadFormData';
import { AppFieldValidationErrors } from './fieldValidations';

export const validateOmsorgstilbud = (omsorgstilbud: OmsorgstilbudFormData): ValidationResult<ValidationError> => {
    if (omsorgstilbud.erIOmsorgstilbud === OmsorgstilbudSvar.FAST_OG_REGELMESSIG) {
        const { fasteDager } = omsorgstilbud;

        const hoursInTotal = fasteDager
            ? durationToDecimalDuration(summarizeDurationInDurationWeekdays(fasteDager))
            : 0;
        if (hoursInTotal === 0) {
            return AppFieldValidationErrors.omsorgstilbud_gruppe_ingenInfo;
        }
        if (hoursInTotal > 37.5) {
            return AppFieldValidationErrors.omsorgstilbud_gruppe_forMangeTimerTotalt;
        }
    }
    return undefined;
};
