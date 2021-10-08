import { DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import { DagMedTid, TidEnkeltdag, TidFasteDager } from '../types';

export const MIN_ANTALL_DAGER_FOR_FAST_PLAN = 20;

const isValidNumberString = (value: any): boolean =>
    hasValue(value) && typeof value === 'string' && value.trim().length > 0;

/**
 * Fjerner dager med ugyldige verdier
 */
export const getValidEnkeltdager = (tidEnkeltdag: TidEnkeltdag): TidEnkeltdag => {
    const cleanedTidEnkeltdag: TidEnkeltdag = {};
    Object.keys(tidEnkeltdag).forEach((key) => {
        const tid = tidEnkeltdag[key];
        if (isValidTime(tid) && (isValidNumberString(tid.hours) || isValidNumberString(tid.minutes))) {
            cleanedTidEnkeltdag[key] = tid;
        }
    });
    return cleanedTidEnkeltdag;
};

export const sumTimerFasteDager = (uke: TidFasteDager): number => {
    return Object.keys(uke).reduce((timer: number, key: string) => {
        return timer + timeToDecimalTime(uke[key]);
    }, 0);
};

export const sumTimerEnkeltdager = (dager: TidEnkeltdag): number => {
    return Object.keys(dager).reduce((timer: number, key: string) => {
        return (
            timer +
            timeToDecimalTime({
                hours: dager[key].hours || '0',
                minutes: dager[key].minutes || '0',
            })
        );
    }, 0);
};

export const mapTidEnkeltdagToDagMedTid = (tidEnkeltdag: TidEnkeltdag): DagMedTid[] => {
    const dager: DagMedTid[] = [];
    Object.keys(tidEnkeltdag).forEach((key) => {
        const dato = ISOStringToDate(key);
        if (dato) {
            dager.push({
                dato,
                tid: tidEnkeltdag[key],
            });
        }
    });
    return dager;
};

export const getTidEnkeltdagerInnenforPeriode = (dager: TidEnkeltdag, periode: DateRange): TidEnkeltdag => {
    const dagerIPerioden: TidEnkeltdag = {};
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

export const getDagerMedTidITidsrom = (data: TidEnkeltdag, tidsrom: DateRange): DagMedTid[] => {
    const dager: DagMedTid[] = [];
    Object.keys(data || {}).forEach((isoDateString) => {
        const date = ISOStringToDate(isoDateString);
        if (date && datoErInnenforTidsrom(date, tidsrom)) {
            const time = data[isoDateString];
            if (time) {
                dager.push({
                    dato: date,
                    tid: time,
                });
            }
        }
        return false;
    });
    return dager;
};

export const visSpørsmålOmTidErLikHverUke = (periode: DateRange): boolean => {
    const antallDager = dayjs(periode.to).diff(periode.from, 'days');
    if (antallDager < MIN_ANTALL_DAGER_FOR_FAST_PLAN) {
        return false;
    }
    return true;
};
