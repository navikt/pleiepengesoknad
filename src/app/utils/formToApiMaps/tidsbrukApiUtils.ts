import { apiStringDateToDate, DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { dateToISOString, InputTime, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { DatoTidMap, TidUkedager } from '../../types';
import { ISO8601Duration, TidEnkeltdagApiData } from '../../types/SøknadApiData';
import { isDateWeekDay } from '@navikt/sif-common-utils';

export const getFasteDagerApiData = ({ mandag, tirsdag, onsdag, torsdag, fredag }: TidUkedager) => ({
    mandag: mandag ? timeToIso8601Duration(mandag) : undefined,
    tirsdag: tirsdag ? timeToIso8601Duration(tirsdag) : undefined,
    onsdag: onsdag ? timeToIso8601Duration(onsdag) : undefined,
    torsdag: torsdag ? timeToIso8601Duration(torsdag) : undefined,
    fredag: fredag ? timeToIso8601Duration(fredag) : undefined,
});

const sortTidEnkeltdagApiData = (d1: TidEnkeltdagApiData, d2: TidEnkeltdagApiData): number =>
    dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1;

export const getEnkeltdagerIPeriodeApiData = (enkeltdager: DatoTidMap, periode: DateRange): TidEnkeltdagApiData[] => {
    const dager: TidEnkeltdagApiData[] = [];

    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && datoErInnenforTidsrom(dato, periode) && isDateWeekDay(dato)) {
            dager.push({
                dato: dateToISOString(dato),
                tid: timeToIso8601Duration(enkeltdager[dag].varighet),
            });
        }
    });

    return dager.sort(sortTidEnkeltdagApiData);
};

export const getEnkeltdagerMedTidIPeriodeApiData = (
    tidPerDag: Partial<InputTime>,
    enkeltdager: DatoTidMap,
    periode: DateRange
): TidEnkeltdagApiData[] => {
    const dager: TidEnkeltdagApiData[] = [];
    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        const tid = timeToIso8601Duration(tidPerDag);
        if (dato && datoErInnenforTidsrom(dato, periode)) {
            dager.push({
                dato: dateToISOString(dato),
                tid,
            });
        }
    });
    return dager.sort(sortTidEnkeltdagApiData);
};

export const fjernTidUtenforPeriodeOgHelgedager = (
    periode: Partial<DateRange>,
    tidEnkeltdag?: TidEnkeltdagApiData[]
): TidEnkeltdagApiData[] | undefined => {
    const { from, to } = periode;
    if (!tidEnkeltdag || (!from && !to)) {
        return tidEnkeltdag;
    }
    return tidEnkeltdag.filter((dag) => {
        const dato = apiStringDateToDate(dag.dato);
        if (isDateWeekDay(dato) === false) {
            return false;
        }
        if (from && dayjs(dato).isBefore(from, 'day')) {
            return false;
        }
        if (to && dayjs(dato).isAfter(to, 'day')) {
            return false;
        }
        return true;
    });
};

export const getRedusertArbeidstidSomIso8601Duration = (
    jobberNormaltTimerPerDagNumber: number,
    skalJobbeProsent: number
): ISO8601Duration => {
    return timeToIso8601Duration(getRedusertArbeidstidSomInputTime(jobberNormaltTimerPerDagNumber, skalJobbeProsent));
};

export const getRedusertArbeidstidSomInputTime = (
    jobberNormaltTimerPerDagNumber: number,
    skalJobbeProsent: number
): InputTime => {
    const redusertTidPerDag = (jobberNormaltTimerPerDagNumber / 100) * skalJobbeProsent;
    return decimalTimeToTime(redusertTidPerDag);
};
