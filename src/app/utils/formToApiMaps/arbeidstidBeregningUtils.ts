import {
    ArbeidstimerApiData,
    ArbeidstimerFasteDagerApiData,
    getRedusertArbeidstidSomISODuration,
} from '@navikt/sif-common-pleiepenger/lib';
import {
    decimalDurationToDuration,
    durationToISODuration,
    DurationWeekdays,
    durationWeekdaysToISODurationWeekdays,
    getPercentageOfISODuration,
    ISODuration,
} from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidApiData, TimerFasteDagerApiData } from '../../types/SøknadApiData';

export const getArbeidstimerRedusert = (
    normalTimer: ISODuration | undefined,
    prosent: number
): ArbeidstimerApiData | undefined => {
    if (normalTimer) {
        const faktiskTimer = prosent === 100 ? normalTimer : getPercentageOfISODuration(normalTimer, prosent);
        if (faktiskTimer) {
            return {
                normalTimer,
                faktiskTimer,
            };
        }
    }
    return undefined;
};

export const getFasteDagerSomProsentAvFasteDager = (
    fasteDager: TimerFasteDagerApiData,
    prosent: number
): ArbeidstimerFasteDagerApiData => {
    return {
        mandag: getArbeidstimerRedusert(fasteDager.mandag, prosent),
        tirsdag: getArbeidstimerRedusert(fasteDager.tirsdag, prosent),
        onsdag: getArbeidstimerRedusert(fasteDager.onsdag, prosent),
        torsdag: getArbeidstimerRedusert(fasteDager.torsdag, prosent),
        fredag: getArbeidstimerRedusert(fasteDager.fredag, prosent),
    };
};

export const getFasteDagerUtFraTimerPerUke = (
    jobberNormaltTimerNumber: number,
    prosent: number
): ArbeidstimerFasteDagerApiData => {
    const decimalTimerPerDag = jobberNormaltTimerNumber / 5;
    const faktiskTimer = getRedusertArbeidstidSomISODuration(decimalTimerPerDag, prosent);
    const fasteArbeidstimer: ArbeidstimerApiData = {
        normalTimer: durationToISODuration(decimalDurationToDuration(decimalTimerPerDag)),
        faktiskTimer,
    };
    return {
        mandag: fasteArbeidstimer,
        tirsdag: fasteArbeidstimer,
        onsdag: fasteArbeidstimer,
        torsdag: fasteArbeidstimer,
        fredag: fasteArbeidstimer,
    };
};

export const getArbeidstimerDag = (
    normalTimer?: ISODuration,
    faktiskTimer?: ISODuration
): ArbeidstimerApiData | undefined => {
    if (normalTimer && faktiskTimer) {
        return {
            normalTimer,
            faktiskTimer,
        };
    }
    return undefined;
};

export const getArbeidstimerUtFraFasteDager = (
    arbeidstimerNormalt: NormalarbeidstidApiData,
    fasteDager: DurationWeekdays
): ArbeidstimerFasteDagerApiData => {
    if (arbeidstimerNormalt.erLiktHverUke) {
        const normalTimer = arbeidstimerNormalt.timerFasteDager;
        const faktiskTimer = durationWeekdaysToISODurationWeekdays(fasteDager);
        return {
            mandag: getArbeidstimerDag(normalTimer.mandag, faktiskTimer.monday),
            tirsdag: getArbeidstimerDag(normalTimer.tirsdag, faktiskTimer.tuesday),
            onsdag: getArbeidstimerDag(normalTimer.onsdag, faktiskTimer.wednesday),
            torsdag: getArbeidstimerDag(normalTimer.torsdag, faktiskTimer.thursday),
            fredag: getArbeidstimerDag(normalTimer.fredag, faktiskTimer.friday),
        };
    } else {
        // Dette skal ikke skje på grunn av at arbeidstimer normalt som varierer, må fylle ut enkeltdager
        return {};
    }
};
