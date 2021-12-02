import { DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { InputTime, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import moize from 'moize';
import { DatoTidMap, TidFasteDager } from '../types';
import { timeToISODuration } from './timeUtils';

export const MIN_ANTALL_DAGER_FOR_FAST_PLAN = 6;

const isValidNumberString = (value: any): boolean =>
    hasValue(value) && typeof value === 'string' && value.trim().length > 0;

/**
 * Fjerner dager med ugyldige verdier
 */
export const getValidEnkeltdager = (datoTid: DatoTidMap): DatoTidMap => {
    const cleanedTidEnkeltdag: DatoTidMap = {};
    Object.keys(datoTid).forEach((key) => {
        const { tid } = datoTid[key];
        if (isValidTime(tid) && (isValidNumberString(tid.hours) || isValidNumberString(tid.minutes))) {
            cleanedTidEnkeltdag[key] = { tid };
        }
    });
    return cleanedTidEnkeltdag;
};

export const sumTimerFasteDager = (uke: TidFasteDager): number => {
    return Object.keys(uke).reduce((timer: number, key: string) => {
        return timer + timeToDecimalTime(uke[key]);
    }, 0);
};

export const sumTimerEnkeltdager = (dager: DatoTidMap): number => {
    return Object.keys(dager).reduce((timer: number, key: string) => {
        return (
            timer +
            timeToDecimalTime({
                hours: dager[key].tid.hours || '0',
                minutes: dager[key].tid.minutes || '0',
            })
        );
    }, 0);
};

export const getTidEnkeltdagerInnenforPeriode = (dager: DatoTidMap, periode: DateRange): DatoTidMap => {
    const dagerIPerioden: DatoTidMap = {};
    Object.keys(dager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && dayjs(dato).isBetween(periode.from, periode.to, 'day', '[]')) {
            dagerIPerioden[dag] = dager[dag];
        }
    });
    return dagerIPerioden;
};

export const getSøkerKunHistoriskPeriode = (søknadsperiode: DateRange, søknadsdato: Date) =>
    dayjs(søknadsperiode.to).isBefore(søknadsdato, 'day');

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

export const getEnkeltdagerMedTidITidsrom = (data: DatoTidMap, tidsrom: DateRange): DatoTidMap => {
    const dager: DatoTidMap = {};
    Object.keys(data || {}).forEach((isoDateString) => {
        const date = ISOStringToDate(isoDateString);
        if (date && datoErInnenforTidsrom(date, tidsrom)) {
            const time = data[isoDateString];
            if (time) {
                dager[isoDateString] = time;
            }
        }
        return false;
    });
    return dager;
};

export const skalViseSpørsmålOmProsentEllerLiktHverUke = (periode: DateRange): boolean => {
    const antallDager = dayjs(periode.to).diff(periode.from, 'days');
    if (antallDager < MIN_ANTALL_DAGER_FOR_FAST_PLAN) {
        return false;
    }
    return true;
};

export const _tidErIngenTid = (time: InputTime): boolean => {
    return timeToISODuration(time) === 'PT0H0M';
};
export const tidErIngenTid = moize(_tidErIngenTid);
