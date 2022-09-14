import { IntlShape } from 'react-intl';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { IntlErrorObject } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ArbeidIPeriodeIntlValues,
    formatTimerOgMinutter,
    getArbeidstidFastProsentValidator,
} from '@navikt/sif-common-pleiepenger';
import { ArbeidstidUkeInputEnkeltdagValidator } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-uke-input/ArbeidstidUkeInput';
import {
    dateFormatter,
    decimalDurationToDuration,
    durationToDecimalDuration,
    DurationWeekdays,
    getWeekdayFromDate,
    summarizeDurationInDurationWeekdays,
} from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeFormData } from '../../../../types/ArbeidIPeriodeFormData';
import { NormalarbeidstidSøknadsdata } from '../../../../types/søknadsdata/Søknadsdata';

export const getArbeidIPeriodeEnkeltdagValidator =
    (
        timerFasteUkedager: DurationWeekdays,
        intlValues: ArbeidIPeriodeIntlValues
    ): ArbeidstidUkeInputEnkeltdagValidator | undefined =>
    (date) =>
    (duration) => {
        const weekday = getWeekdayFromDate(date);
        if (!weekday) {
            return undefined;
        }
        const dag = dateFormatter.dayDateShortMonthYear(date);
        const error = getTimeValidator({
            min: { hours: 0, minutes: 0 },
            max: { hours: 24, minutes: 60 },
        })(duration);
        return error
            ? {
                  key: `validation.arbeidIPeriode.enkeltdagerFastNormaltid.tid.${error}`,
                  keepKeyUnaltered: true,
                  values: { ...intlValues, dag },
              }
            : undefined;

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
              const error = validateArbeidstimerFasteUkedager(
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

const validateArbeidstimerFasteUkedager =
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
export const getArbeidIPeriodeFasteUkedagerValidator = (
    intlValues: ArbeidIPeriodeIntlValues,
    normalarbeidstid: NormalarbeidstidSøknadsdata,
    arbeidIPeriode?: ArbeidIPeriodeFormData
) =>
    normalarbeidstid.erLiktHverUke === true && normalarbeidstid.erFasteUkedager && normalarbeidstid.timerFasteUkedager
        ? () => {
              const { fasteDager } = arbeidIPeriode || {};
              const timerNormaltPerUke = durationToDecimalDuration(
                  summarizeDurationInDurationWeekdays(normalarbeidstid.timerFasteUkedager)
              );
              const error = validateArbeidstimerFasteUkedager(timerNormaltPerUke, false)(fasteDager);
              return error
                  ? {
                        key: `validation.arbeidIPeriode.timer.${error.key}`,
                        values: intlValues,
                        keepKeyUnaltered: true,
                    }
                  : undefined;
          }
        : undefined;
