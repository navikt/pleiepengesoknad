import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { IntlErrorObject } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidIPeriodeIntlValues,
    formatTimerOgMinutter,
    getArbeidstidFastProsentValidator,
} from '@navikt/sif-common-pleiepenger/lib';
import {
    dateFormatter,
    decimalDurationToDuration,
    Duration,
    durationToDecimalDuration,
    DurationWeekdays,
    getNumberDurationOrUndefined,
    getWeekdayFromDate,
    NumberDuration,
    summarizeDurationInDurationWeekdays,
    Weekday,
} from '@navikt/sif-common-utils/lib';
import { IntlShape } from 'react-intl';
import { ArbeidIPeriodeFormData } from '../../../../types/ArbeidIPeriodeFormData';
import { NormalarbeidstidSøknadsdata } from '../../../../types/Søknadsdata';
import { ArbeidstidUkeInputEnkeltdagValidator } from '../arbeidstid-uker-input/ArbeidstidUkeInput';

export const getDurationForWeekday = (fasteDager: DurationWeekdays, ukedag: Weekday): NumberDuration | undefined => {
    switch (ukedag) {
        case 'monday':
            return getNumberDurationOrUndefined(fasteDager.monday);
        case 'tuesday':
            return getNumberDurationOrUndefined(fasteDager.tuesday);
        case 'wednesday':
            return getNumberDurationOrUndefined(fasteDager.wednesday);
        case 'thursday':
            return getNumberDurationOrUndefined(fasteDager.thursday);
        case 'friday':
            return getNumberDurationOrUndefined(fasteDager.friday);
        default:
            return undefined;
    }
};

export const getArbeidIPeriodeEnkeltdagValidator =
    (
        timerFasteUkedager: DurationWeekdays,
        intlValues: ArbeidIPeriodeIntlValues
    ): ArbeidstidUkeInputEnkeltdagValidator | undefined =>
    (date) =>
    (duration) => {
        const weekday = getWeekdayFromDate(date);
        if (!weekday) {
            // lørdag eller søndag
            return undefined;
        }
        const normaltidDag = getDurationForWeekday(timerFasteUkedager, weekday);
        const nyTid = duration ? durationToDecimalDuration(duration) : undefined;
        const dag = dateFormatter.extendedWithDayName(date);
        if (nyTid && !normaltidDag) {
            return {
                key: `validation.arbeidIPeriode.enkeltdagerFastNormaltid.dagUtenNormaltid`,
                keepKeyUnaltered: true,
                values: { ...intlValues, dag },
            };
        }
        if (normaltidDag) {
            const error = getTimeValidator({
                min: { hours: 0, minutes: 0 },
                max: { hours: normaltidDag.hours, minutes: normaltidDag.minutes },
            })(duration);
            return error
                ? {
                      key: `validation.arbeidIPeriode.enkeltdagerFastNormaltid.tid.${error}`,
                      keepKeyUnaltered: true,
                      values: { ...intlValues, maksTimer: normaltidDag, dag },
                  }
                : undefined;
        }
        return undefined;
    };
export const getArbeidIPeriodeFasteDagerDagValidator =
    (
        timerFasteUkedager: DurationWeekdays,
        intlValues: ArbeidIPeriodeIntlValues,
        getDagnavn: (weekday: string) => string
    ) =>
    (weekday: string, value: Duration | undefined) => {
        const dag = getDagnavn(weekday);
        const normaltidDag = getDurationForWeekday(timerFasteUkedager, weekday as Weekday);
        const nyTid = value ? durationToDecimalDuration(value) : undefined;

        if (nyTid && !normaltidDag) {
            return {
                key: `validation.arbeidIPeriode.fast.tid.dagUtenNormaltid`,
                keepKeyUnaltered: true,
                values: { ...intlValues, dag },
            };
        }
        if (normaltidDag) {
            const error = getTimeValidator({
                min: { hours: 0, minutes: 0 },
                max: { hours: normaltidDag.hours, minutes: normaltidDag.minutes },
            })(value);
            return error
                ? {
                      key: `validation.arbeidIPeriode.fast.tid.${error}`,
                      keepKeyUnaltered: true,
                      values: { ...intlValues, maksTimer: normaltidDag, dag },
                  }
                : undefined;
        }
        return undefined;
    };

export const getFasteArbeidstimerPerUkeValidator =
    (maksTimer: number = 24 * 5, tillatLiktAntallTimer: boolean) =>
    (fasteDager: DurationWeekdays | undefined): IntlErrorObject | undefined => {
        const timer = fasteDager ? durationToDecimalDuration(summarizeDurationInDurationWeekdays(fasteDager)) : 0;
        if (timer === 0) {
            return {
                key: `ingenTidRegistrert`,
            };
        }
        if (tillatLiktAntallTimer && timer <= maksTimer) {
            return undefined;
        }
        if (timer >= maksTimer) {
            return {
                key: `forMangeTimer`,
            };
        }
        return undefined;
    };

export const getArbeidIPeriodeProsentAvNormaltValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: string) => {
    const min = 1;
    const max = 99;
    const error = getArbeidstidFastProsentValidator({ min, max })(value);
    return error
        ? {
              key: `validation.arbeidIPeriode.fast.prosent.${error.key}`,
              values: { ...intlValues, min, max },
              keepKeyUnaltered: true,
          }
        : undefined;
};

export const getArbeidIPeriodeTimerPerUkeISnittValidator =
    (intl: IntlShape, intlValues: ArbeidIPeriodeIntlValues, timerNormalt: number) => (value: string) => {
        const min = 1;
        const error = getArbeidstidFastProsentValidator({ min, max: timerNormalt })(value);
        return error
            ? {
                  key: `validation.arbeidIPeriode.fast.timerPerUke.${error.key}`,
                  values: {
                      ...intlValues,
                      min,
                      max: formatTimerOgMinutter(intl, decimalDurationToDuration(timerNormalt)),
                  },
                  keepKeyUnaltered: true,
              }
            : undefined;
    };

export const getArbeidIPeriodeTimerEllerProsentValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
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

export const getArbeidIPeriodeArbeiderIPeriodenValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidIPeriode.arbeider',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : error;
};

export const getArbeidIPeriodeErLiktHverUkeValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidIPeriode.erLiktHverUke',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : undefined;
};

export const getArbeidIPeriodeTimerPerUkeValidator = (
    intlValues: ArbeidIPeriodeIntlValues,
    normalarbeidstid: NormalarbeidstidSøknadsdata,
    arbeidIPeriode?: ArbeidIPeriodeFormData
) =>
    normalarbeidstid.erLiktHverUke === false && normalarbeidstid.timerPerUkeISnitt
        ? () => {
              const error = getFasteArbeidstimerPerUkeValidator(
                  normalarbeidstid.timerPerUkeISnitt,
                  false
              )(arbeidIPeriode?.fasteDager);
              return error
                  ? {
                        key: `validation.arbeidIPeriode.timer.${error.key}`,
                        values: intlValues,
                        keepKeyUnaltered: true,
                    }
                  : undefined;
          }
        : undefined;
