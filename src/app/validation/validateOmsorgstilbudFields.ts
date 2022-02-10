import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { durationToDecimalDuration, summarizeDurationInDurationWeekdays } from '@navikt/sif-common-utils';
import { Omsorgstilbud } from '../types/SøknadFormData';
import { AppFieldValidationErrors } from './fieldValidations';

export const validateOmsorgstilbud = (omsorgstilbud: Omsorgstilbud): ValidationResult<ValidationError> => {
    if (omsorgstilbud.erIOmsorgstilbud === YesOrNo.YES) {
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
