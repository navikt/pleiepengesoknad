import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { getRedusertArbeidstidSomISODuration } from '@navikt/sif-common-pleiepenger';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData, TidFasteDagerApiData } from '../../types/SøknadApiData';
import { ArbeidIPeriode, Arbeidsforhold, ArbeidsforholdFrilanser } from '../../types/SøknadFormData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import {
    fjernTidUtenforPeriodeOgHelgedager,
    getEnkeltdagerIPeriodeApiData,
    getFasteDagerApiData,
} from './tidsbrukApiUtils';

const lagFasteDagerUtFraProsentIPeriode = (
    jobberNormaltTimerNumber: number,
    jobberProsent: number
): TidFasteDagerApiData => {
    const timerPerDag = jobberNormaltTimerNumber / 5;
    const tid = getRedusertArbeidstidSomISODuration(timerPerDag, jobberProsent);
    return {
        mandag: tid,
        tirsdag: tid,
        onsdag: tid,
        torsdag: tid,
        fredag: tid,
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

    const erLiktHverUke = isYesOrNoAnswered(arbeid.erLiktHverUke) ? arbeid.erLiktHverUke === YesOrNo.YES : undefined;
    const enkeltdager =
        arbeid.enkeltdager && !erLiktHverUke ? getEnkeltdagerIPeriodeApiData(arbeid.enkeltdager, periode) : undefined;

    return {
        ...apiData,
        erLiktHverUke,
        enkeltdager: arbeidsperiode ? fjernTidUtenforPeriodeOgHelgedager(arbeidsperiode, enkeltdager) : enkeltdager,
        fasteDager: arbeid.fasteDager && erLiktHverUke ? getFasteDagerApiData(arbeid.fasteDager) : undefined,
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
        throw new Error('mapArbeidsforholdToApiData');
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
