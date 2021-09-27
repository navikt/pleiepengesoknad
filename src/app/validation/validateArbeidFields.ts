import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import {
    getDateValidator,
    getNumberValidator,
    getRequiredFieldValidator,
} from '@navikt/sif-common-formik/lib/validation';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidIPeriodeIntlValues } from '../components/arbeidstid/ArbeidIPeriodeSpørsmål';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import { ArbeidIPeriode } from '../types/PleiepengesøknadFormData';
import { sumTimerFasteDager } from '../utils/tidsbrukUtils';
import { AppFieldValidationErrors } from './fieldValidations';

export const validateFrilanserStartdato = (datoString?: string): ValidationResult<ValidationError> => {
    return getDateValidator({ required: true, max: dateToday })(datoString);
};

export const validateFasteArbeidstimerIUke = (
    arbeid: ArbeidIPeriode | undefined,
    intlValues: ArbeidIPeriodeIntlValues
): ValidationResult<ValidationError> => {
    let error;
    const timer = arbeid?.fasteDager ? sumTimerFasteDager(arbeid?.fasteDager) : 0;
    if (timer === 0) {
        error = AppFieldValidationErrors.arbeidIPeriode_fasteDager_ingenTidRegistrert;
    }
    if (timer > 37.5) {
        error = AppFieldValidationErrors.arbeidIPeriode_fasteDager_forMangeTimer;
    }
    return error
        ? {
              key: `validation.${error}`,
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : undefined;
};

export const getArbeidstimerDatoValidator =
    (dato: string) =>
    (time: Time): ValidationResult<ValidationError> => {
        const error = time
            ? getTimeValidator({ max: { hours: 23, minutes: 59 }, min: { hours: 0, minutes: 0 } })(time)
            : undefined;
        if (error) {
            return {
                key: `validation.arbeidstimer.dato.tid.${error}`,
                values: { dato },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const getArbeidstimerFastDagValidator =
    (dag: string) =>
    (time: Time): ValidationResult<ValidationError> => {
        const error = time
            ? getTimeValidator({ max: { hours: 23, minutes: 59 }, min: { hours: 0, minutes: 0 } })(time)
            : undefined;
        if (error) {
            return {
                key: `validation.arbeidstimer.fastdag.tid.${error}`,
                values: { dag },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const getArbeidsformValidator = (intlValues: { hvor: string; jobber: string }) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidsforhold.arbeidsform.noValue',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : undefined;
};

export const getJobberNormaltTimerValidator =
    (intlValues: { hvor: string; jobber: string; arbeidsform?: string }) => (value: any) => {
        if (!intlValues.arbeidsform) {
            return undefined;
        }
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

export const getArbeidJobberValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidIPeriode.skalJobbe',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : error;
};

export const getArbeidJobberSomVanligValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidIPeriode.jobberSomVanlig',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : undefined;
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
