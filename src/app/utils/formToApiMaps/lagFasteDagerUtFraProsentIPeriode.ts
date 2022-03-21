import {
    ArbeidstimerApiData,
    ArbeidstimerFasteDagerApiData,
    getRedusertArbeidstidSomISODuration,
} from '@navikt/sif-common-pleiepenger/lib';
import { decimalDurationToDuration, durationToISODuration } from '@navikt/sif-common-utils/lib';

export const lagFasteDagerUtFraProsentIPeriode = (
    jobberNormaltTimerNumber: number,
    jobberProsent: number
): ArbeidstimerFasteDagerApiData => {
    const decimalTimerPerDag = jobberNormaltTimerNumber / 5;
    const faktiskTimer = getRedusertArbeidstidSomISODuration(decimalTimerPerDag, jobberProsent);
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
