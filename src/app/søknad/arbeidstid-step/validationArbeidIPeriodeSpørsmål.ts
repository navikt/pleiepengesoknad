import { IntlShape } from 'react-intl';
import {
    getNumberValidator,
    getRequiredFieldValidator,
    ValidateNumberError,
} from '@navikt/sif-common-formik/lib/validation';
import {
    ArbeidIPeriodeIntlValues,
    formatTimerOgMinutter,
    getArbeidstidFastProsentValidator,
} from '@navikt/sif-common-pleiepenger';
import { dateRangeUtils, decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import { ArbeidsukeInfo } from '../../types/ArbeidsukeInfo';
import { IntlErrorObject } from '@navikt/sif-common-formik/lib/validation/types';
import { getArbeidsdagerIUkeTekst } from './utils/arbeidstidUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';

export const getArbeidIPeriodeProsentAvNormaltValidator =
    (intlValues: ArbeidIPeriodeIntlValues, arbeidsuke?: ArbeidsukeInfo) => (value: string) => {
        const ukeinfo = arbeidsuke ? `${arbeidsuke.ukenummer}` : undefined;
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

export const getArbeidstidTimerSnittPerUkeValidator =
    (minMax?: { min: number; max: number }) =>
    (value: any): IntlErrorObject | undefined => {
        const minMaxOptions = minMax || {
            min: 0,
            max: 100,
        };

        const error = getNumberValidator({ required: true, ...minMaxOptions })(value);
        return error
            ? {
                  key: error,
                  values: { ...minMaxOptions },
              }
            : undefined;
    };

const getMaksArbeidstimerIPeriode = (periode: DateRange): number => {
    const arbeidsdagerIPeriode = dateRangeUtils.getNumberOfDaysInDateRange(periode);
    return arbeidsdagerIPeriode * 24;
};

export const getArbeidIPeriodeTimerPerUkeISnittValidator =
    (intl: IntlShape, intlValues: ArbeidIPeriodeIntlValues, timerNormalt: number, arbeidsuke?: ArbeidsukeInfo) =>
    (value: string) => {
        const min = arbeidsuke ? 0 : 1;
        const ukeinfo = arbeidsuke ? `${arbeidsuke.ukenummer}` : undefined;

        const error = getArbeidstidTimerSnittPerUkeValidator({ min, max: timerNormalt })(value);

        if (error) {
            return {
                key: `validation.arbeidIPeriode.fast.timerPerUke.${arbeidsuke ? 'uke.' : ''}${error.key}`,
                values: {
                    ...intlValues,
                    ukeinfo,
                    min,
                    max: formatTimerOgMinutter(intl, decimalDurationToDuration(timerNormalt)),
                },
                keepKeyUnaltered: true,
            };
        }

        if (arbeidsuke && arbeidsuke.arbeidsdagerPeriode !== undefined) {
            const maksTimerIPeriode = getMaksArbeidstimerIPeriode(arbeidsuke.arbeidsdagerPeriode);
            const forMangeTimerUtFraDagerError = getArbeidstidTimerSnittPerUkeValidator({
                min,
                max: maksTimerIPeriode,
            })(value);
            if (
                forMangeTimerUtFraDagerError &&
                forMangeTimerUtFraDagerError.key === ValidateNumberError.numberIsTooLarge
            ) {
                return {
                    key: `validation.arbeidIPeriode.fast.timerPerUke.${
                        arbeidsuke ? 'uke.' : ''
                    }${'flereTimerEnnTilgjengeligIUke'}`,
                    values: {
                        ...intlValues,
                        ukeinfo,
                        min,
                        max: formatTimerOgMinutter(intl, decimalDurationToDuration(maksTimerIPeriode)),
                        dagInfo: getArbeidsdagerIUkeTekst(arbeidsuke.arbeidsdagerPeriode),
                    },
                    keepKeyUnaltered: true,
                };
            }
        }
        return undefined;
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
