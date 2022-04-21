import { ArbeidstidEnkeltdagApiData } from '@navikt/sif-common-pleiepenger';
import {
    DateDurationMap,
    dateToISODate,
    Duration,
    durationToISODuration,
    DurationWeekdays,
    ISODate,
    ISODateToDate,
    ISODuration,
    ISODurationToMaybeDuration,
    Weekday,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { ArbeiderIPeriodenSvar } from '../../types/ArbeidIPeriodeFormData';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    TimerFasteDagerApiData,
} from '../../types/søknad-api-data/SøknadApiData';
import {
    ArbeidIPeriodeSøknadsdata,
    ArbeidIPeriodeType,
    ArbeidsforholdSøknadsdata,
    NormalarbeidstidSøknadsdata,
    NormalarbeidstidType,
} from '../../types/søknadsdata/Søknadsdata';
import { getNormalarbeidstidApiDataFromSøknadsdata } from './getNormalarbeidstidApiDataFromSøknadsdata';

export const dateToISODateOrUndefined = (date?: Date): ISODate | undefined => (date ? dateToISODate(date) : undefined);

export const durationToISODurationOrUndefined = (duration?: Duration): ISODuration | undefined =>
    duration ? durationToISODuration(duration) : undefined;

export const ISODurationToDurationOrUndefined = (isoDuration?: ISODuration): Duration | undefined =>
    isoDuration ? ISODurationToMaybeDuration(isoDuration) : undefined;

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

export const timerFasteDagerApiDataToDurationWeekdays = (timerFasteDager: TimerFasteDagerApiData): DurationWeekdays => {
    return {
        monday: ISODurationToDurationOrUndefined(timerFasteDager.mandag),
        tuesday: ISODurationToDurationOrUndefined(timerFasteDager.tirsdag),
        wednesday: ISODurationToDurationOrUndefined(timerFasteDager.onsdag),
        thursday: ISODurationToDurationOrUndefined(timerFasteDager.torsdag),
        friday: ISODurationToDurationOrUndefined(timerFasteDager.fredag),
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
            case ArbeidIPeriodeType.arbeiderIkke:
                return {
                    type: ArbeidIPeriodeType.arbeiderIkke,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær,
                };
            case ArbeidIPeriodeType.arbeiderVanlig:
                return {
                    type: ArbeidIPeriodeType.arbeiderVanlig,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
                };
            case ArbeidIPeriodeType.arbeiderEnkeltdager:
                if (normalarbeidstid.type === NormalarbeidstidType.likeUkerOgDager) {
                    return {
                        type: ArbeidIPeriodeType.arbeiderEnkeltdager,
                        arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                        enkeltdager: arbeidEnkeltdagerToArbeidstidEnkeltdagApiData(
                            arbeid.enkeltdager,
                            normalarbeidstid.timerFasteUkedager
                        ),
                    };
                }
                return undefined;
            case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
                return {
                    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                    prosentAvNormalt: arbeid.prosentAvNormalt,
                };
            case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
                return {
                    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                    timerPerUke: arbeid.timerISnittPerUke,
                };
            case ArbeidIPeriodeType.arbeiderFasteUkedager:
                return {
                    type: ArbeidIPeriodeType.arbeiderFasteUkedager,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
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
    return {
        normalarbeidstid,
        arbeidIPeriode: getArbeidIPeriodeApiDataFromSøknadsdata(
            arbeidsforhold.arbeidISøknadsperiode,
            arbeidsforhold.normalarbeidstid
        ),
    };
};
