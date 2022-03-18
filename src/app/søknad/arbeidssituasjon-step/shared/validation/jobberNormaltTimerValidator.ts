import { getNumberValidator } from '@navikt/sif-common-formik/lib/validation';

export const MIN_TIMER_NORMAL_ARBEIDSFORHOLD = 0.01;
export const MAX_TIMER_NORMAL_ARBEIDSFORHOLD = 100;

const validateJobberNormaltTimerIUken = (value: any) => {
    return getNumberValidator({
        required: true,
        min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
        max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
    })(value);
};

export const getJobberNormaltTimerIUkenValidator = (intlValues: { hvor: string; jobber: string }) => (value: any) => {
    const error = validateJobberNormaltTimerIUken(value);
    return error
        ? {
              key: `validation.arbeidsforhold.jobberNormaltTimerPerUke.${error}`,
              values: {
                  ...intlValues,
                  min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                  max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
              },
              keepKeyUnaltered: true,
          }
        : undefined;
};
