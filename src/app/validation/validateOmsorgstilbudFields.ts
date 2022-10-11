import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { durationToDecimalDuration, summarizeDurationInDurationWeekdays } from '@navikt/sif-common-utils';
import { OmsorgstilbudFormData } from '../types/SøknadFormValues';
import { AppFieldValidationErrors } from './fieldValidations';

export const validateOmsorgstilbud = (omsorgstilbud: OmsorgstilbudFormData): ValidationResult<ValidationError> => {
    if (omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.YES) {
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
