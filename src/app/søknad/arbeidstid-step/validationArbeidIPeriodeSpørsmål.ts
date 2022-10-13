import { IntlShape } from 'react-intl';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import {
    ArbeidIPeriodeIntlValues,
    formatTimerOgMinutter,
    getArbeidstidFastProsentValidator,
} from '@navikt/sif-common-pleiepenger';
import { ArbeidstidUkeInputEnkeltdagValidator } from '@navikt/sif-common-pleiepenger/lib/arbeidstid/arbeidstid-uke-input/ArbeidstidUkeInput';
import { dateFormatter, decimalDurationToDuration, getWeekdayFromDate } from '@navikt/sif-common-utils/lib';
import { WeekOfYearInfo } from '../../types/WeekOfYear';

export const getArbeidIPeriodeEnkeltdagValidator =
    (intlValues: ArbeidIPeriodeIntlValues): ArbeidstidUkeInputEnkeltdagValidator | undefined =>
    (date) =>
    (duration) => {
        const weekday = getWeekdayFromDate(date);
        if (!weekday) {
            // lørdag eller søndag
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
    };

export const getArbeidIPeriodeProsentAvNormaltValidator =
    (intlValues: ArbeidIPeriodeIntlValues, arbeidsuke?: WeekOfYearInfo) => (value: string) => {
        const ukeinfo = arbeidsuke ? `${arbeidsuke.weekNumber}` : undefined;
        const { min, max } = arbeidsuke ? { min: 0, max: 100 } : { min: 1, max: 99 };
        const error = getArbeidstidFastProsentValidator({ min, max })(value);
        return error
            ? {
                  key: `validation.arbeidIPeriode.fast.prosent.${arbeidsuke ? 'uke.' : ''}${error.key}`,
                  values: { ...intlValues, min, max, ukeinfo },
                  keepKeyUnaltered: true,
              }
            : undefined;
    };

export const getArbeidIPeriodeTimerPerUkeISnittValidator =
    (intl: IntlShape, intlValues: ArbeidIPeriodeIntlValues, timerNormalt: number, arbeidsuke?: WeekOfYearInfo) =>
    (value: string) => {
        const min = arbeidsuke ? 0 : 1;
        const ukeinfo = arbeidsuke ? `${arbeidsuke.weekNumber}` : undefined;
        const error = getArbeidstidFastProsentValidator({ min, max: timerNormalt })(value);

        return error
            ? {
                  key: `validation.arbeidIPeriode.fast.timerPerUke.${arbeidsuke ? 'uke.' : ''}${error.key}`,
                  values: {
                      ...intlValues,
                      ukeinfo,
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
