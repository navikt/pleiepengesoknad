import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import { TidIOmsorgstilbud } from '../components/omsorgstilbud/types';
import { OmsorgstilbudFasteDager } from '../types/PleiepengesøknadFormData';

export const MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA = 20;

export const visKunEnkeltdagerForOmsorgstilbud = (søknadsperiode: DateRange): boolean => {
    const antallDager = dayjs(søknadsperiode.to).diff(søknadsperiode.from, 'days');
    if (antallDager <= MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA) {
        return true;
    }
    return false;
};

export const getPeriodeFørSøknadsdato = (søknadsperiode: DateRange, søknadsdato: Date): DateRange | undefined => {
    if (søknadsperiodeInkludererFortid(søknadsperiode, søknadsdato)) {
        return {
            from: søknadsperiode.from,
            to: dayjs(søknadsdato).subtract(1, 'day').toDate(),
        };
    }
    return undefined;
};

export const getPeriodeFraOgMedSøknadsdato = (søknadsperiode: DateRange, søknadsdato: Date): DateRange | undefined => {
    if (søknadsperiodeInkludererDagensDatoEllerFremtid(søknadsperiode, søknadsdato)) {
        return {
            from: søknadsdato,
            to: søknadsperiode.to,
        };
    }
    return undefined;
};

export const søknadsperiodeInkludererFortid = (søknadsperiode: DateRange, søknadsdato: Date): boolean =>
    dayjs(søknadsperiode.from).isBefore(søknadsdato, 'day');

export const søknadsperiodeInkludererDagensDatoEllerFremtid = (søknadsperiode: DateRange, søknadsdato: Date): boolean =>
    dayjs(søknadsperiode.to).isSameOrAfter(søknadsdato, 'day');

const isValidNumberString = (value: any): boolean =>
    hasValue(value) && typeof value === 'string' && value.trim().length > 0;

export const getCleanedTidIOmsorgstilbud = (tidIOmsorg: TidIOmsorgstilbud): TidIOmsorgstilbud => {
    const cleanedTidIOmsorg: TidIOmsorgstilbud = {};
    Object.keys(tidIOmsorg).forEach((key) => {
        const tid = tidIOmsorg[key];
        if (isValidTime(tid) && (isValidNumberString(tid.hours) || isValidNumberString(tid.minutes))) {
            cleanedTidIOmsorg[key] = tid;
        }
    });
    return cleanedTidIOmsorg;
};

export const sumTimerMedOmsorgstilbud = (uke: OmsorgstilbudFasteDager): number => {
    return Object.keys(uke).reduce((timer: number, key: string) => {
        return timer + timeToDecimalTime(uke[key]);
    }, 0);
};

export const getMaxTimerMedOmsorgstilbudOneDay = (
    uke: OmsorgstilbudFasteDager
): { maxHours: number; day: string | undefined } | undefined => {
    let maxHours = 0;
    let day;
    Object.keys(uke).forEach((key) => {
        const hours = timeToDecimalTime(uke[key]);
        if (hours > maxHours) {
            maxHours = hours;
            day = key;
        }
    });
    return day !== undefined
        ? {
              maxHours,
              day,
          }
        : undefined;
};
