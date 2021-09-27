import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Time } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { Omsorgstilbud } from '../types/PleiepengesøknadFormData';
import { sumTimerFasteDager } from '../utils/tidsbrukUtils';
import { AppFieldValidationErrors, TidPerDagValidator } from './fieldValidations';

export const validateSkalIOmsorgstilbud = (omsorgstilbud: Omsorgstilbud): ValidationResult<ValidationError> => {
    if (omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES) {
        if (omsorgstilbud.planlagt === undefined) {
            return AppFieldValidationErrors.omsorgstilbud_ingenInfo;
        }
        const fasteDager = omsorgstilbud.planlagt.fasteDager;

        const hoursInTotal = fasteDager ? sumTimerFasteDager(fasteDager) : 0;
        if (hoursInTotal === 0) {
            return AppFieldValidationErrors.omsorgstilbud_ingenInfo;
        }
        if (hoursInTotal > 37.5) {
            return AppFieldValidationErrors.omsorgstilbud_forMangeTimerTotalt;
        }
    }
    return undefined;
};

export const getOmsorgstilbudtimerValidatorEnDag =
    (dag: string) =>
    (time: Time): ValidationResult<ValidationError> => {
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

export const getTidIOmsorgValidator: TidPerDagValidator = (dag: string) => (tid: Time) => {
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
