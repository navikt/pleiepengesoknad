import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import { TidIOmsorgstilbud } from '../components/omsorgstilbud/types';
import { OmsorgstilbudFasteDager } from '../types/PleiepengesøknadFormData';

dayjs.extend(isSameOrAfter);
dayjs.extend(minMax);

export const MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA = 20;

export const visKunEnkeltdagerForOmsorgstilbud = (søknadsperiode: DateRange): boolean => {
    const antallDager = dayjs(søknadsperiode.to).diff(søknadsperiode.from, 'days');
    if (antallDager <= MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA) {
        return true;
    }
    return false;
};

export const getHistoriskPeriode = (søknadsperiode: DateRange, søknadsdato: Date): DateRange | undefined => {
    const yesterday = dayjs(søknadsdato).subtract(1, 'day').toDate();
    if (dayjs(søknadsperiode.from).isBefore(søknadsdato, 'day')) {
        return {
            from: søknadsperiode.from,
            to: dayjs.min([dayjs(søknadsperiode.to), dayjs(yesterday)]).toDate(),
        };
    }
    return undefined;
};

export const getPlanlagtPeriode = (søknadsperiode: DateRange, søknadsdato: Date): DateRange | undefined => {
    const from: Date = dayjs.max([dayjs(søknadsdato), dayjs(søknadsperiode.from)]).toDate();
    if (dayjs(søknadsperiode.to).isSameOrAfter(søknadsdato, 'day')) {
        return {
            from,
            to: søknadsperiode.to,
        };
    }
    return undefined;
};

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
