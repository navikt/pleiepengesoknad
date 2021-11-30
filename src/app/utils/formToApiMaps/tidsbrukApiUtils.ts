import { apiStringDateToDate, DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { decimalTimeToTime, timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { dateToISOString, ISOStringToDate, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { TidEnkeltdag, TidFasteDager } from '../../types';
import { ISO8601Duration, TidEnkeltdagApiData } from '../../types/PleiepengesøknadApiData';

export const getFasteDagerApiData = ({ mandag, tirsdag, onsdag, torsdag, fredag }: TidFasteDager) => ({
    mandag: mandag ? timeToIso8601Duration(mandag) : undefined,
    tirsdag: tirsdag ? timeToIso8601Duration(tirsdag) : undefined,
    onsdag: onsdag ? timeToIso8601Duration(onsdag) : undefined,
    torsdag: torsdag ? timeToIso8601Duration(torsdag) : undefined,
    fredag: fredag ? timeToIso8601Duration(fredag) : undefined,
});

const sortTidEnkeltdagApiData = (d1: TidEnkeltdagApiData, d2: TidEnkeltdagApiData): number =>
    dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1;

export const getEnkeltdagerIPeriodeApiData = (enkeltdager: TidEnkeltdag, periode: DateRange): TidEnkeltdagApiData[] => {
    const dager: TidEnkeltdagApiData[] = [];

    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && datoErInnenforTidsrom(dato, periode)) {
            dager.push({
                dato: dateToISOString(dato),
                tid: timeToIso8601Duration(enkeltdager[dag]),
            });
        }
    });

    return dager.sort(sortTidEnkeltdagApiData);
};

export const getEnkeltdagerMedTidIPeriodeApiData = (
    tidPerDag: Partial<InputTime>,
    enkeltdager: TidEnkeltdag,
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

export const fjernTidUtenforPeriode = (
    periode: Partial<DateRange>,
    tidEnkeltdag?: TidEnkeltdagApiData[]
): TidEnkeltdagApiData[] | undefined => {
    const { from, to } = periode;
    if (!tidEnkeltdag || (!from && !to)) {
        return tidEnkeltdag;
    }
    return tidEnkeltdag.filter((dag) => {
        const dato = apiStringDateToDate(dag.dato);
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
    jobberNormaltTimerNumber: number,
    skalJobbeProsent: number
): ISO8601Duration => {
    const redusertTidPerDag = (jobberNormaltTimerNumber / 100) * skalJobbeProsent;
    return timeToIso8601Duration(decimalTimeToTime(redusertTidPerDag));
};

export const getRedusertArbeidstidSomInputTime = (
    jobberNormaltTimerNumber: number,
    skalJobbeProsent: number
): InputTime => {
    const redusertTidPerDag = (jobberNormaltTimerNumber / 100) * skalJobbeProsent;
    return decimalTimeToTime(redusertTidPerDag);
};
