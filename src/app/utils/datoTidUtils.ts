import { DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import { inputTimeDurationIsZero } from './common/inputTimeUtils';
import { ISODateToDate } from './common/isoDateUtils';
import { inputTimeToISODuration } from './common/isoDurationUtils';
import { Tid, DatoTidMap, ISODate, TidUkedager, DatoTidArray } from '../types';

const isValidNumberString = (value: any): boolean =>
    hasValue(value) && typeof value === 'string' && value.trim().length > 0;

export const datoTidMapToDatoTidArray = (map: DatoTidMap): DatoTidArray => {
    return Object.keys(map).map((key) => ({
        isoDate: key,
        dato: ISODateToDate(key),
        tid: map[key],
    }));
};

/**
 * Fjerner alle dager som har ugyldig tid
 * @param datoTid
 * @returns DatoTidMap
 */
export const cleanupDatoTidMap = (datoTid: DatoTidMap): DatoTidMap => {
    const cleanedTidEnkeltdag: DatoTidMap = {};
    Object.keys(datoTid).forEach((key) => {
        const { varighet } = datoTid[key] || {};
        if (
            varighet &&
            isValidTime(varighet) &&
            (isValidNumberString(varighet.hours) || isValidNumberString(varighet.minutes))
        ) {
            cleanedTidEnkeltdag[key] = { varighet };
        }
    });
    return cleanedTidEnkeltdag;
};

export const summerTidUkedager = (uke: TidUkedager): number => {
    return Object.keys(uke).reduce((timer: number, key: string) => {
        return timer + timeToDecimalTime(uke[key]);
    }, 0);
};

export const summerDatoTidMap = (datoTid: DatoTidMap): number => {
    return Object.keys(datoTid).reduce((timer: number, key: string) => {
        return (
            timer +
            timeToDecimalTime({
                hours: datoTid[key].varighet.hours || '0',
                minutes: datoTid[key].varighet.minutes || '0',
            })
        );
    }, 0);
};

export const getAntallDagerMedTidMerEnnNull = (dager: DatoTidMap): number =>
    Object.keys(dager).filter((key) => {
        const datoTid = dager[key];
        return (
            datoTid !== undefined &&
            datoTid.varighet !== undefined &&
            inputTimeDurationIsZero(datoTid.varighet) === false
        );
    }).length;

/**
 * Hent ut alle dager som har en tid i tidsrommet
 * @param data
 * @param tidsrom
 * @returns DatoTidMap
 */
export const getDagerMedTidITidsrom = (data: DatoTidMap, tidsrom: DateRange): DatoTidMap => {
    const dager: DatoTidMap = {};
    Object.keys(data || {}).forEach((isoDate) => {
        const date = ISOStringToDate(isoDate);
        if (date && datoErInnenforTidsrom(date, tidsrom)) {
            const time = data[isoDate];
            if (time) {
                dager[isoDate] = time;
            }
        }
        return false;
    });
    return dager;
};

/**
 * Sjekker om oppgitt tid er lik
 * @param datoTid1 Tid 1
 * @param datoTid2 Tid 2
 * @returns boolean
 */
export const datoTidErLik = (datoTid1: Tid, datoTid2: Tid): boolean => {
    if (datoTid1.prosent || datoTid2.prosent) {
        return datoTid1.prosent === datoTid2.prosent;
    }
    return inputTimeToISODuration(datoTid1.varighet) === inputTimeToISODuration(datoTid2.varighet);
};

interface PeriodeMedDatoTid {
    periode: DateRange;
    tid: Tid;
    datoer: ISODate[];
}

export const getPerioderMedLikTidIDatoTidMap = (datoTidMap: DatoTidMap): PeriodeMedDatoTid[] => {
    const dagerMedTid = Object.keys(datoTidMap)
        .sort((d1, d2): number => (dayjs(ISODateToDate(d1)).isBefore(ISODateToDate(d2), 'day') ? -1 : 1))
        .map((key, index, arr) => {
            const forrige = index > 0 ? { dato: arr[index - 1], tid: datoTidMap[arr[index - 1]] } : undefined;
            return {
                dato: ISODateToDate(key),
                isoDate: key,
                tid: datoTidMap[key],
                forrige,
            };
        })
        .filter((dag) => (dag.tid.varighet ? inputTimeDurationIsZero(dag.tid.varighet) === false : false));

    if (dagerMedTid.length === 0) {
        return [];
    }
    if (dagerMedTid.length === 1) {
        return [
            {
                periode: {
                    from: ISODateToDate(dagerMedTid[0].isoDate),
                    to: ISODateToDate(dagerMedTid[0].isoDate),
                },
                tid: dagerMedTid[0].tid,
                datoer: [dagerMedTid[0].isoDate],
            },
        ];
    }
    const perioder: PeriodeMedDatoTid[] = [];
    let startNyPeriode: ISODate = dagerMedTid[0].isoDate;
    let datoerIPeriode: ISODate[] = [];
    dagerMedTid.forEach(({ isoDate, tid, forrige }, index) => {
        if (index > 0 && forrige) {
            if (datoTidErLik(forrige.tid, tid)) {
                if (datoerIPeriode.length === 0) {
                    datoerIPeriode.push(startNyPeriode);
                }
                datoerIPeriode.push(isoDate);
            } else {
                perioder.push({
                    periode: { from: ISODateToDate(startNyPeriode), to: ISODateToDate(forrige.dato) },
                    tid,
                    datoer: [...datoerIPeriode],
                });
                datoerIPeriode = [];
                startNyPeriode = isoDate;
            }
        }
    });

    const sisteDag = dagerMedTid[dagerMedTid.length - 1];
    if (startNyPeriode !== sisteDag.isoDate) {
        perioder.push({
            periode: { from: ISODateToDate(startNyPeriode), to: ISODateToDate(sisteDag.isoDate) },
            tid: sisteDag.tid,
            datoer: [...datoerIPeriode],
        });
    }
    return perioder;
};
