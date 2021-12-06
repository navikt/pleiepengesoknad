import { DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import { ISODateString } from 'nav-datovelger/lib/types';
import { DatoTid, DatoTidMap, TidUkedager } from '../types';
import { ISODateToDate } from './common/isoDateUtils';
import { inputTimeToISODuration } from './common/isoDurationUtils';
import { inputTimeDurationIsZero } from './common/inputTimeUtils';

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

export const summerTidUkedager = (uke: TidUkedager): number => {
    return Object.keys(uke).reduce((timer: number, key: string) => {
        return timer + timeToDecimalTime(uke[key]);
    }, 0);
};

export const summerTidEnkeltdager = (dager: DatoTidMap): number => {
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

interface DatoTidPeriode {
    periode: DateRange;
    tid: DatoTid;
    datoer: ISODateString[];
}

export const datoTidErLik = (datoTid1: DatoTid, datoTid2: DatoTid): boolean => {
    if (datoTid1.prosent || datoTid2.prosent) {
        return datoTid1.prosent === datoTid2.prosent;
    }
    return inputTimeToISODuration(datoTid1.tid) === inputTimeToISODuration(datoTid2.tid);
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
        .filter((dag) => (dag.tid.tid ? inputTimeDurationIsZero(dag.tid.tid) === false : false));

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
