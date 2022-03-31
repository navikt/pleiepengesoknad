import { apiStringDateToDate, DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import {
    DateDurationMap,
    durationToISODuration,
    durationUtils,
    DurationWeekdays,
    isDateWeekDay,
    // ISODuration,
} from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import {
    ArbeidstidEnkeltdagApiData,
    // ArbeidstimerFasteDagerApiData,
    TidEnkeltdagApiData,
    TimerFasteDagerApiData,
} from '../../types/SøknadApiData';

export const getFasteDagerApiData = ({
    monday: mandag,
    tuesday: tirsdag,
    wednesday: onsdag,
    thursday: torsdag,
    friday: fredag,
}: DurationWeekdays): TimerFasteDagerApiData => ({
    mandag: mandag ? durationToISODuration(mandag) : undefined,
    tirsdag: tirsdag ? durationToISODuration(tirsdag) : undefined,
    onsdag: onsdag ? durationToISODuration(onsdag) : undefined,
    torsdag: torsdag ? durationToISODuration(torsdag) : undefined,
    fredag: fredag ? durationToISODuration(fredag) : undefined,
});

// export const getFasteArbeidsdagerApiData = (
//     { monday: mandag, tuesday: tirsdag, wednesday: onsdag, thursday: torsdag, friday: fredag }: DurationWeekdays,
//     normalTimerDag: ISODuration
// ): ArbeidstimerFasteDagerApiData => {
//     const normalTimer = normalTimerDag;
//     return {
//         mandag: mandag ? { faktiskTimer: durationToISODuration(mandag), normalTimer } : undefined,
//         tirsdag: tirsdag ? { faktiskTimer: durationToISODuration(tirsdag), normalTimer } : undefined,
//         onsdag: onsdag ? { faktiskTimer: durationToISODuration(onsdag), normalTimer } : undefined,
//         torsdag: torsdag ? { faktiskTimer: durationToISODuration(torsdag), normalTimer } : undefined,
//         fredag: fredag ? { faktiskTimer: durationToISODuration(fredag), normalTimer } : undefined,
//     };
// };

const sortTidEnkeltdagApiData = (
    d1: TidEnkeltdagApiData | ArbeidstidEnkeltdagApiData,
    d2: TidEnkeltdagApiData | ArbeidstidEnkeltdagApiData
): number => (dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1);

export const getEnkeltdagerIPeriodeApiData = (
    enkeltdager: DateDurationMap,
    periode: DateRange
): TidEnkeltdagApiData[] => {
    const dager: TidEnkeltdagApiData[] = [];

    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && datoErInnenforTidsrom(dato, periode) && isDateWeekDay(dato)) {
            if (durationUtils.durationIsZero(enkeltdager[dag])) {
                return;
            }
            dager.push({
                dato: dateToISOString(dato),
                tid: durationToISODuration(enkeltdager[dag]),
            });
        }
    });
    return dager.sort(sortTidEnkeltdagApiData);
};

// export const getArbeidstidEnkeltdagerIPeriodeApiData = (
//     enkeltdager: DateDurationMap,
//     enkeltdagerNormalt: DateDurationMap
// ): ArbeidstidEnkeltdagApiData[] => {
//     const dager: ArbeidstidEnkeltdagApiData[] = [];

//     Object.keys(enkeltdager).forEach((dag) => {
//         const dato = ISOStringToDate(dag);
//         if (dato && isDateWeekDay(dato)) {
//             if (durationUtils.durationIsZero(enkeltdager[dag])) {
//                 return;
//             }
//             const faktiskTimer = durationToISODuration(enkeltdager[dag]);
//             const normalTimer = durationToISODuration(enkeltdagerNormalt[dag]);

//             if (!faktiskTimer || !normalTimer) {
//                 throw 'getArbeidstidEnkeltdagerIPeriodeApiData - Faktisk eller normaltimer er undefined';
//             }

//             dager.push({
//                 dato: dateToISOString(dato),
//                 arbeidstimer: {
//                     faktiskTimer,
//                     normalTimer,
//                 },
//             });
//         }
//     });
//     return dager.sort(sortTidEnkeltdagApiData);
// };

export const fjernArbeidstimerUtenforPeriodeOgHelgedager = (
    periode: Partial<DateRange>,
    arbeidstidEnkeltdag?: ArbeidstidEnkeltdagApiData[]
): ArbeidstidEnkeltdagApiData[] | undefined => {
    const { from, to } = periode;
    if (!arbeidstidEnkeltdag || (!from && !to)) {
        return arbeidstidEnkeltdag;
    }
    return arbeidstidEnkeltdag.filter((dag) => {
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
