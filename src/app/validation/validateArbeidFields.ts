import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger';
import {
    DateDurationMap,
    durationToDecimalDuration,
    getDurationsInDateRange,
    getValidDurations,
    summarizeDateDurationMap,
} from '@navikt/sif-common-utils';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';

export const validateArbeidsTidEnkeltdager = (
    tidMedArbeid: DateDurationMap,
    periode: DateRange,
    intlValues: ArbeidIPeriodeIntlValues
): ValidationResult<ValidationError> => {
    const tidIPerioden = getDurationsInDateRange(tidMedArbeid, periode);
    const validTidEnkeltdager = getValidDurations(tidIPerioden);
    const hasElements = Object.keys(validTidEnkeltdager).length > 0;

    if (!hasElements || durationToDecimalDuration(summarizeDateDurationMap(validTidEnkeltdager)) <= 0) {
        return {
            key: `validation.arbeidIPeriode.enkeltdager.ingenTidRegistrert`,
            keepKeyUnaltered: true,
            values: intlValues,
        };
    }
    return undefined;
};

export const getArbeidstidTimerEllerProsentValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    if (error) {
        return {
            key: `validation.arbeidIPeriode.timerEllerProsent.${error}`,
            values: { ...intlValues, min: 1, max: 99 },
            keepKeyUnaltered: true,
        };
    }
    return undefined;
};

export const getJobberNormaltTimerValidator = (intlValues: { hvor: string; jobber: string }) => (value: any) => {
    const error = getNumberValidator({
        required: true,
        min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
        max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
    })(value);

    return error
        ? {
              key: `validation.arbeidsforhold.jobberNormaltTimer.${error}`,
              values: {
                  ...intlValues,
                  min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                  max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
              },
              keepKeyUnaltered: true,
          }
        : undefined;
};

export const getJobberIPeriodenValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidIPeriode.jobber',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : error;
};

export const getArbeidErLiktHverUkeValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidIPeriode.erLiktHverUke',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : undefined;
};
