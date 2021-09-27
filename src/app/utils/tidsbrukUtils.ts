import { DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToDecimalTime, timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { DagMedTid, TidEnkeltdag, TidFasteDager } from '../types';
import { TidEnkeltdagApiData } from '../types/PleiepengesøknadApiData';

export const sumTimerFasteDager = (uke: TidFasteDager): number => {
    return Object.keys(uke).reduce((timer: number, key: string) => {
        return timer + timeToDecimalTime(uke[key]);
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

export const getFasteDagerApiData = ({ mandag, tirsdag, onsdag, torsdag, fredag }: TidFasteDager) => ({
    mandag: mandag ? timeToIso8601Duration(mandag) : undefined,
    tirsdag: tirsdag ? timeToIso8601Duration(tirsdag) : undefined,
    onsdag: onsdag ? timeToIso8601Duration(onsdag) : undefined,
    torsdag: torsdag ? timeToIso8601Duration(torsdag) : undefined,
    fredag: fredag ? timeToIso8601Duration(fredag) : undefined,
});

const soretTidEnkeltdagApiData = (d1: TidEnkeltdagApiData, d2: TidEnkeltdagApiData): number =>
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

    return dager.sort(soretTidEnkeltdagApiData);
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
