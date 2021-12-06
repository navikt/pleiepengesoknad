import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { InputTime } from '@navikt/sif-common-formik/lib';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { ArbeidIPeriodeIntlValues } from '../søknad/arbeid-i-periode-steps/ArbeidIPeriodeSpørsmål';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import { DatoTidMap, TidUkedager } from '../types';
import {
    getValidEnkeltdager,
    getTidEnkeltdagerInnenforPeriode,
    summerTidEnkeltdager,
    summerTidUkedager,
} from '../utils/datoTidUtils';
import { AppFieldValidationErrors } from './fieldValidations';

export const validateFasteArbeidstimerIUke = (
    fasteDager: TidUkedager | undefined,
    intlValues: ArbeidIPeriodeIntlValues
): ValidationResult<ValidationError> => {
    let error;
    const timer = fasteDager ? summerTidUkedager(fasteDager) : 0;
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
    tidMedArbeid: DatoTidMap,
    periode: DateRange,
    erHistorisk: boolean | undefined,
    intlValues: ArbeidIPeriodeIntlValues
): ValidationResult<ValidationError> => {
    const tidIPerioden = getTidEnkeltdagerInnenforPeriode(tidMedArbeid, periode);
    const validTidEnkeltdager = getValidEnkeltdager(tidIPerioden);
    const hasElements = Object.keys(validTidEnkeltdager).length > 0;

    if (!hasElements || summerTidEnkeltdager(validTidEnkeltdager) <= 0) {
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
    (time: InputTime): ValidationResult<ValidationError> => {
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
    (time: InputTime): ValidationResult<ValidationError> => {
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

export const getArbeidstidProsentValidator =
    (intlValues: ArbeidIPeriodeIntlValues, minMax?: { min: number; max: number }) => (value: any) => {
        const minMaxOptions = minMax || {
            min: 1,
            max: 99,
        };
        const error = getNumberValidator({ required: true, ...minMaxOptions })(value);
        if (error) {
            return {
                key: `validation.arbeidstimer.prosent.${error}`,
                values: { ...intlValues, ...minMaxOptions },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const getArbeidstidTimerEllerProsentValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    if (error) {
        return {
            key: `validation.arbeidstimer.timerEllerProsent.${error}`,
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
