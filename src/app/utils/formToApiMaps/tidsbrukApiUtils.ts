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
