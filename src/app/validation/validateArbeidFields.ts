import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidIPeriodeIntlValues } from '../components/arbeidstid/ArbeidIPeriodeSpørsmål';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import { TidEnkeltdag } from '../types';
import { ArbeidIPeriode } from '../types/PleiepengesøknadFormData';
import {
    getValidEnkeltdager,
    getTidEnkeltdagerInnenforPeriode,
    sumTimerEnkeltdager,
    sumTimerFasteDager,
} from '../utils/tidsbrukUtils';
import { AppFieldValidationErrors } from './fieldValidations';

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

export const validateArbeidsTidEnkeltdager = (
    tidMedArbeid: TidEnkeltdag,
    periode: DateRange,
    erHistorisk: boolean | undefined,
    intlValues: ArbeidIPeriodeIntlValues
): ValidationResult<ValidationError> => {
    const tidIPerioden = getTidEnkeltdagerInnenforPeriode(tidMedArbeid, periode);
    const validTidEnkeltdager = getValidEnkeltdager(tidIPerioden);
    const hasElements = Object.keys(validTidEnkeltdager).length > 0;

    if (!hasElements || sumTimerEnkeltdager(validTidEnkeltdager) <= 0) {
        return {
            key: erHistorisk
                ? `validation.arbeidIPeriode.enkeltdager.historisk.ingenTidRegistrert`
                : `validation.arbeidIPeriode.enkeltdager.ingenTidRegistrert`,
            keepKeyUnaltered: true,
            values: intlValues,
        };
    }
    return undefined;
};

export const getArbeidstimerEnkeltdagValidator =
    (intlValues: ArbeidIPeriodeIntlValues) =>
    (dato: string) =>
    (time: Time): ValidationResult<ValidationError> => {
        const error = time
            ? getTimeValidator({ max: { hours: 24, minutes: 0 }, min: { hours: 0, minutes: 0 } })(time)
            : undefined;
        if (error) {
            return {
                key: `validation.arbeidstimer.dato.tid.${error}`,
                values: { ...intlValues, dato },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const getArbeidstimerFastDagValidator =
    (dag: string) =>
    (time: Time): ValidationResult<ValidationError> => {
        const error = time
            ? getTimeValidator({ max: { hours: 24, minutes: 0 }, min: { hours: 0, minutes: 0 } })(time)
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
export const getArbeidstidProsentValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getNumberValidator({ required: true, max: 99, min: 1 })(value);
    if (error) {
        return {
            key: `validation.arbeidstimer.prosent.${error}`,
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
