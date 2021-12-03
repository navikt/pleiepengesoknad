import { DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { InputTime, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import moize from 'moize';
import { ISODateString } from 'nav-datovelger/lib/types';
import { DatoTid, DatoTidMap, TidFasteDager } from '../types';
import { ISODateToDate } from './dateUtils';
import { ensureTime, timeToISODuration } from './timeUtils';

export const MIN_ANTALL_DAGER_FOR_FAST_PLAN = 6;

const isValidNumberString = (value: any): boolean =>
    hasValue(value) && typeof value === 'string' && value.trim().length > 0;

/**
 * Fjerner dager med ugyldige verdier
 */
export const getValidEnkeltdager = (datoTid: DatoTidMap): DatoTidMap => {
    const cleanedTidEnkeltdag: DatoTidMap = {};
    Object.keys(datoTid).forEach((key) => {
        const { tid } = datoTid[key] || {};
        if (tid && isValidTime(tid) && (isValidNumberString(tid.hours) || isValidNumberString(tid.minutes))) {
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

interface DatoTidPeriode {
    periode: DateRange;
    tid: DatoTid;
    datoer: ISODateString[];
}

export const datoTidErLik = (datoTid1: DatoTid, datoTid2: DatoTid): boolean => {
    if (datoTid1.prosent || datoTid2.prosent) {
        return datoTid1.prosent === datoTid2.prosent;
    }
    return timeToISODuration(datoTid1.tid) === timeToISODuration(datoTid2.tid);
};

export const getPerioderFraDatoTidMap = (datoTidMap: DatoTidMap): DatoTidPeriode[] => {
    const dagerMedTid = Object.keys(datoTidMap)
        .sort((d1, d2): number => (dayjs(ISODateToDate(d1)).isBefore(ISODateToDate(d2), 'day') ? -1 : 1))
        .map((key, index, arr) => {
            const forrige = index > 0 ? { dato: arr[index - 1], tid: datoTidMap[arr[index - 1]] } : undefined;
            return {
                dato: ISODateToDate(key),
                isoDateString: key,
                tid: datoTidMap[key],
                forrige,
            };
        })
        .filter((dag) => (dag.tid.tid ? tidErIngenTid(ensureTime(dag.tid.tid)) === false : false));

    if (dagerMedTid.length === 0) {
        return [];
    }
    if (dagerMedTid.length === 1) {
        return [
            {
                periode: {
                    from: ISODateToDate(dagerMedTid[0].isoDateString),
                    to: ISODateToDate(dagerMedTid[0].isoDateString),
                },
                tid: dagerMedTid[0].tid,
                datoer: [dagerMedTid[0].isoDateString],
            },
        ];
    }
    const perioder: DatoTidPeriode[] = [];
    let startNyPeriode: ISODateString = dagerMedTid[0].isoDateString;
    let datoerIPeriode: ISODateString[] = [];
    dagerMedTid.forEach(({ isoDateString, tid, forrige }, index) => {
        if (index > 0 && forrige) {
            if (datoTidErLik(forrige.tid, tid)) {
                if (datoerIPeriode.length === 0) {
                    datoerIPeriode.push(startNyPeriode);
                }
                datoerIPeriode.push(isoDateString);
            } else {
                perioder.push({
                    periode: { from: ISODateToDate(startNyPeriode), to: ISODateToDate(forrige.dato) },
                    tid,
                    datoer: [...datoerIPeriode],
                });
                datoerIPeriode = [];
                startNyPeriode = isoDateString;
            }
        }
    });

    const sisteDag = dagerMedTid[dagerMedTid.length - 1];
    if (startNyPeriode !== sisteDag.isoDateString) {
        perioder.push({
            periode: { from: ISODateToDate(startNyPeriode), to: ISODateToDate(sisteDag.isoDateString) },
            tid: sisteDag.tid,
            datoer: [...datoerIPeriode],
        });
    }
    return perioder;
};
