import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { InputTime } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { TidPerDagValidator } from '@navikt/sif-common-pleiepenger';
import { durationToDecimalDuration, summarizeDurationInDurationWeekdays } from '@navikt/sif-common-utils';
import { Omsorgstilbud } from '../types/SøknadFormData';
import { AppFieldValidationErrors } from './fieldValidations';

export const validatePlanlagtOmsorgstilbud = (omsorgstilbud: Omsorgstilbud): ValidationResult<ValidationError> => {
    if (omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES) {
        if (omsorgstilbud.planlagt === undefined) {
            return AppFieldValidationErrors.omsorgstilbud_ingenInfo;
        }
        const fasteDager = omsorgstilbud.planlagt.fasteDager;

        const hoursInTotal = fasteDager
            ? durationToDecimalDuration(summarizeDurationInDurationWeekdays(fasteDager))
            : 0;
        if (hoursInTotal === 0) {
            return AppFieldValidationErrors.omsorgstilbud_ingenInfo;
        }
        if (hoursInTotal > 37.5) {
            return AppFieldValidationErrors.omsorgstilbud_forMangeTimerTotalt;
        }
    }
    return undefined;
};

export const validateHistoriskOmsorgstilbud = (omsorgstilbud: Omsorgstilbud): ValidationResult<ValidationError> => {
    if (omsorgstilbud.harBarnVærtIOmsorgstilbud === YesOrNo.YES) {
        if (omsorgstilbud.historisk === undefined) {
            return AppFieldValidationErrors.omsorgstilbud_ingenInfo;
        }
        const fasteDager = omsorgstilbud.historisk.fasteDager;

        const hoursInTotal = fasteDager
            ? durationToDecimalDuration(summarizeDurationInDurationWeekdays(fasteDager))
            : 0;
        if (hoursInTotal === 0) {
            return AppFieldValidationErrors.omsorgstilbud_ingenInfo;
        }
        if (hoursInTotal > 37.5) {
            return AppFieldValidationErrors.omsorgstilbud_forMangeTimerTotalt;
        }
    }
    return undefined;
};

export const getOmsorgstilbudtimerValidatorFastDag =
    (dag: string) =>
    (time: InputTime): ValidationResult<ValidationError> => {
        const error = time
            ? getTimeValidator({ max: { hours: 7, minutes: 30 }, min: { hours: 0, minutes: 0 } })(time)
            : undefined;
        if (error) {
            return {
                key: `validation.omsorgstilbud.planlagt.fastDag.tid.${error}`,
                values: { dag },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const getTidIOmsorgValidator: TidPerDagValidator = (dag: string) => (tid: InputTime) => {
    const error = getTimeValidator({
        required: false,
        max: { hours: 7, minutes: 30 },
    })(tid);
    return error
        ? {
              key: `omsorgstilbud.validation.${error}`,
              values: {
                  dag,
                  maksTimer: '7 timer og 30 minutter',
              },
              keepKeyUnaltered: true,
          }
        : undefined;
};
