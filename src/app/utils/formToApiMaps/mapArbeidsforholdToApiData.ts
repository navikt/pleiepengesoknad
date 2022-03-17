import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { getRedusertArbeidstidSomISODuration } from '@navikt/sif-common-pleiepenger';
import { decimalDurationToDuration, durationToISODuration } from '@navikt/sif-common-utils/lib';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../types';
import { ArbeidIPeriode } from '../../types/ArbeidIPeriode';
import { Arbeidsforhold, ArbeidsforholdFrilanser } from '../../types/Arbeidsforhold';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    ArbeidstimerApiData,
    ArbeidstimerFasteDagerApiData,
} from '../../types/SøknadApiData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import {
    fjernArbeidstimerUtenforPeriodeOgHelgedager,
    getArbeidstidEnkeltdagerIPeriodeApiData,
    getFasteArbeidsdagerApiData,
} from './tidsbrukApiUtils';

const lagFasteDagerUtFraProsentIPeriode = (
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

export const mapArbeidIPeriodeToApiData = (
    arbeid: ArbeidIPeriode,
    periode: DateRange,
    jobberNormaltTimerNumber: number,
    /** Periode hvor en er aktiv og som kan påvirke dager innenfor perioden, f.eks. noen som starter/slutter i periode */
    arbeidsperiode: Partial<DateRange> | undefined
): ArbeidIPeriodeApiData => {
    const apiData: ArbeidIPeriodeApiData = {
        jobberIPerioden: arbeid.jobberIPerioden,
    };
    if (arbeid.jobberIPerioden !== JobberIPeriodeSvar.JA) {
        return apiData;
    }
    if (arbeid.timerEllerProsent === TimerEllerProsent.PROSENT) {
        const jobberProsentNumber = getNumberFromNumberInputValue(arbeid.jobberProsent);
        if (jobberProsentNumber === undefined) {
            throw new Error('mapArbeidIPeriodeToApiData - jobberProsentNumber undefined');
        }
        return {
            ...apiData,
            erLiktHverUke: true,
            fasteDager: lagFasteDagerUtFraProsentIPeriode(jobberNormaltTimerNumber, jobberProsentNumber),
            jobberProsent: jobberProsentNumber,
        };
    }

    const normalTimerISODuration = durationToISODuration(decimalDurationToDuration(jobberNormaltTimerNumber / 5));
    const erLiktHverUke = isYesOrNoAnswered(arbeid.erLiktHverUke) ? arbeid.erLiktHverUke === YesOrNo.YES : undefined;
    const enkeltdager =
        arbeid.enkeltdager && !erLiktHverUke
            ? getArbeidstidEnkeltdagerIPeriodeApiData(arbeid.enkeltdager, periode, normalTimerISODuration)
            : undefined;

    return {
        ...apiData,
        erLiktHverUke,
        enkeltdager: arbeidsperiode
            ? fjernArbeidstimerUtenforPeriodeOgHelgedager(arbeidsperiode, enkeltdager)
            : enkeltdager,
        fasteDager:
            arbeid.fasteDager && erLiktHverUke
                ? getFasteArbeidsdagerApiData(arbeid.fasteDager, normalTimerISODuration)
                : undefined,
    };
};

export const mapArbeidsforholdToApiData = (
    arbeidsforhold: Arbeidsforhold | ArbeidsforholdFrilanser,
    søknadsperiode: DateRange,
    /** Periode hvor en er aktiv, f.eks. noen som starter sluttet i søknadsperioden */
    arbeidsperiode?: Partial<DateRange>
): ArbeidsforholdApiData => {
    const { jobberNormaltTimer, arbeidIPeriode, harFraværIPeriode } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined) {
        throw new Error('mapArbeidsforholdToApiData: jobberNormaltTimerNumber === undefined');
    }
    return {
        jobberNormaltTimer: jobberNormaltTimerNumber,
        harFraværIPeriode: harFraværIPeriode === YesOrNo.YES,
        arbeidIPeriode:
            harFraværIPeriode === YesOrNo.YES && arbeidIPeriode !== undefined
                ? mapArbeidIPeriodeToApiData(arbeidIPeriode, søknadsperiode, jobberNormaltTimerNumber, arbeidsperiode)
                : undefined,
    };
};
