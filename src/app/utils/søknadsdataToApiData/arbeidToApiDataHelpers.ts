import { ArbeidstidEnkeltdagApiData } from '@navikt/sif-common-pleiepenger/lib';
import {
    DateDurationMap,
    dateToISODate,
    Duration,
    durationToISODuration,
    DurationWeekdays,
    ISODate,
    ISODateToDate,
    ISODuration,
    Weekday,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData, TimerFasteDagerApiData } from '../../types/SøknadApiData';
import {
    ArbeidIPeriodeSøknadsdata,
    ArbeidsforholdSøknadsdata,
    NormalarbeidstidSøknadsdata,
} from '../../types/Søknadsdata';
import { getNormalarbeidstidApiDataFromSøknadsdata } from './getNormalarbeidstidApiDataFromSøknadsdata';

export const dateToISODateOrUndefined = (date?: Date): ISODate | undefined => (date ? dateToISODate(date) : undefined);

export const durationToISODurationOrUndefined = (duration?: Duration): ISODuration | undefined =>
    duration ? durationToISODuration(duration) : undefined;

export const durationWeekdaysToTimerFasteDagerApiData = (
    durationWeekdays: DurationWeekdays
): TimerFasteDagerApiData => {
    return {
        mandag: durationToISODurationOrUndefined(durationWeekdays.monday),
        tirsdag: durationToISODurationOrUndefined(durationWeekdays.tuesday),
        onsdag: durationToISODurationOrUndefined(durationWeekdays.wednesday),
        torsdag: durationToISODurationOrUndefined(durationWeekdays.thursday),
        fredag: durationToISODurationOrUndefined(durationWeekdays.friday),
    };
};

const getWeekdayFromDate = (date: Date): Weekday | undefined => {
    const dow = dayjs(date).isoWeekday();
    switch (dow) {
        case 1:
            return Weekday.monday;
        case 2:
            return Weekday.tuesday;
        case 3:
            return Weekday.wednesday;
        case 4:
            return Weekday.thursday;
        case 5:
            return Weekday.friday;
        default:
            return undefined;
    }
};

const getWeekdayDurationForDate = (date: Date, weekdays: DurationWeekdays): Duration | undefined => {
    const weekday = getWeekdayFromDate(date);
    return weekday ? weekdays[weekday] : undefined;
};

export const arbeidEnkeltdagerToArbeidstidEnkeltdagApiData = (
    enkeltdager: DateDurationMap,
    normalarbeidstidFasteDager: DurationWeekdays
): ArbeidstidEnkeltdagApiData[] => {
    const arbeidstidEnkeltdager: ArbeidstidEnkeltdagApiData[] = [];
    Object.keys(enkeltdager).forEach((dato) => {
        const faktiskTimer = enkeltdager[dato];
        const normaltimer = getWeekdayDurationForDate(ISODateToDate(dato), normalarbeidstidFasteDager);
        if (faktiskTimer && normaltimer) {
            arbeidstidEnkeltdager.push({
                dato,
                arbeidstimer: {
                    faktiskTimer: durationToISODuration(faktiskTimer),
                    normalTimer: durationToISODuration(normaltimer),
                },
            });
        }
    });
    return arbeidstidEnkeltdager;
};

export const getArbeidIPeriodeApiDataFromSøknadsdata = (
    arbeid: ArbeidIPeriodeSøknadsdata | undefined,
    normalarbeidstid: NormalarbeidstidSøknadsdata
): ArbeidIPeriodeApiData | undefined => {
    if (arbeid) {
        switch (arbeid.type) {
            case 'arbeiderIkkeIPerioden':
                return {
                    jobberIPerioden: 'NEI',
                };
            case 'variert':
                return {
                    jobberIPerioden: 'JA',
                    enkeltdager: arbeidEnkeltdagerToArbeidstidEnkeltdagApiData(
                        arbeid.enkeltdager,
                        normalarbeidstid.fasteDager
                    ),
                    erLiktHverUke: false,
                };
            case 'fastProsent':
                return {
                    jobberIPerioden: 'JA',
                    erLiktHverUke: true,
                    fasteDager: durationWeekdaysToTimerFasteDagerApiData(arbeid.fasteDager),
                    jobberProsent: arbeid.jobberProsent,
                };
            case 'fasteDager':
                return {
                    jobberIPerioden: 'JA',
                    erLiktHverUke: true,
                    fasteDager: durationWeekdaysToTimerFasteDagerApiData(arbeid.fasteDager),
                };
        }
    }
    return undefined;
};

export const getArbeidsforholdApiDataFromSøknadsdata = (
    arbeidsforhold: ArbeidsforholdSøknadsdata
): ArbeidsforholdApiData => {
    const normalarbeidstid = getNormalarbeidstidApiDataFromSøknadsdata(arbeidsforhold.normalarbeidstid);
    if (arbeidsforhold.harFraværIPeriode === false) {
        return {
            harFraværIPeriode: false,
            normalarbeidstid,
        };
    }
    return {
        harFraværIPeriode: true,
        normalarbeidstid,
        arbeidIPeriode: getArbeidIPeriodeApiDataFromSøknadsdata(
            arbeidsforhold.arbeidISøknadsperiode,
            arbeidsforhold.normalarbeidstid
        ),
    };
};
