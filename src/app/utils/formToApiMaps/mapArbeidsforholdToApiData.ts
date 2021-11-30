import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { getDatoerIPeriode } from '../../components/tid-uker-input/utils';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../types';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    TidEnkeltdagApiData,
    TidFasteDagerApiData,
} from '../../types/PleiepengesøknadApiData';
import { ArbeidIPeriode, Arbeidsforhold, TimerEllerProsent } from '../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../tidsbrukUtils';
import {
    fjernTidUtenforPeriode,
    getEnkeltdagerIPeriodeApiData,
    getFasteDagerApiData,
    getRedusertArbeidstidSomIso8601Duration,
} from './tidsbrukApiUtils';

export const lagEnkeltdagerUtFraProsentIPeriode = (
    periode: DateRange,
    jobberNormaltTimerNumber: number,
    skalJobbeProsent: number
): TidEnkeltdagApiData[] => {
    const datoer = getDatoerIPeriode(periode);
    const tid = getRedusertArbeidstidSomIso8601Duration(jobberNormaltTimerNumber, skalJobbeProsent);
    return datoer.map(
        (dato): TidEnkeltdagApiData => ({
            dato: dato.isoDateString,
            tid,
        })
    );
};
export const lagFasteDagerUtFraProsentIPeriode = (
    jobberNormaltTimerNumber: number,
    skalJobbeProsent: number
): TidFasteDagerApiData => {
    const timerPerDag = jobberNormaltTimerNumber / 5;
    const tid = getRedusertArbeidstidSomIso8601Duration(timerPerDag, skalJobbeProsent);
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
    if (arbeid.jobberSomVanlig === YesOrNo.YES) {
        return {
            ...apiData,
            jobberSomVanlig: true,
        };
    }
    if (arbeid.timerEllerProsent === TimerEllerProsent.prosent) {
        const skalJobbeProsentNumber = getNumberFromNumberInputValue(arbeid.skalJobbeProsent);
        if (skalJobbeProsentNumber === undefined) {
            throw new Error('mapArbeidIPeriodeToApiData - skalJobbeProsentNumber undefined');
        }
        return {
            ...apiData,
            jobberIPerioden: JobberIPeriodeSvar.JA,
            jobberSomVanlig: false,
            erLiktHverUke: true,
            fasteDager: lagFasteDagerUtFraProsentIPeriode(jobberNormaltTimerNumber, skalJobbeProsentNumber),
            _jobberProsent: skalJobbeProsentNumber,
        };
    }

    const erLiktHverUke = isYesOrNoAnswered(arbeid.erLiktHverUke) ? arbeid.erLiktHverUke === YesOrNo.YES : undefined;
    const enkeltdager =
        arbeid.enkeltdager && !erLiktHverUke ? getEnkeltdagerIPeriodeApiData(arbeid.enkeltdager, periode) : undefined;

    return {
        jobberIPerioden: JobberIPeriodeSvar.JA,
        jobberSomVanlig: false,
        erLiktHverUke,
        enkeltdager: arbeidsperiode ? fjernTidUtenforPeriode(arbeidsperiode, enkeltdager) : enkeltdager,
        fasteDager: arbeid.fasteDager && erLiktHverUke ? getFasteDagerApiData(arbeid.fasteDager) : undefined,
    };
};

export const getHistoriskArbeidIArbeidsforhold = ({
    søkerFortid,
    søkerFremtid,
    arbeidHistoriskPeriode,
    historiskPeriode,
    arbeidsperiode,
    jobberNormaltTimerNumber,
}: {
    søkerFremtid: boolean;
    søkerFortid: boolean;
    historiskPeriode?: DateRange;
    arbeidHistoriskPeriode?: ArbeidIPeriode;
    arbeidsperiode?: Partial<DateRange>;
    jobberNormaltTimerNumber: number;
}): ArbeidIPeriodeApiData | undefined => {
    if (søkerFremtid && !søkerFortid) {
        return undefined;
    }
    return historiskPeriode && arbeidHistoriskPeriode
        ? mapArbeidIPeriodeToApiData(arbeidHistoriskPeriode, historiskPeriode, jobberNormaltTimerNumber, arbeidsperiode)
        : undefined;
};

export const getPlanlagtArbeidIArbeidsforhold = ({
    søkerFortid,
    søkerFremtid,
    arbeidPlanlagtPeriode,
    planlagtPeriode,
    arbeidsperiode,
    jobberNormaltTimerNumber,
}: {
    søkerFremtid: boolean;
    søkerFortid: boolean;
    planlagtPeriode?: DateRange;
    arbeidPlanlagtPeriode?: ArbeidIPeriode;
    arbeidsperiode?: Partial<DateRange>;
    jobberNormaltTimerNumber: number;
}): ArbeidIPeriodeApiData | undefined => {
    if (søkerFortid && !søkerFremtid) {
        return undefined;
    }
    return planlagtPeriode && arbeidPlanlagtPeriode
        ? mapArbeidIPeriodeToApiData(arbeidPlanlagtPeriode, planlagtPeriode, jobberNormaltTimerNumber, arbeidsperiode)
        : undefined;
};

export const mapArbeidsforholdToApiData = (
    arbeidsforhold: Arbeidsforhold,
    søknadsperiode: DateRange,
    type: ArbeidsforholdType,
    søknadsdato: Date,
    /** Periode hvor en er aktiv, f.eks. noen som starter sluttet i søknadsperioden */
    arbeidsperiode?: Partial<DateRange>
): ArbeidsforholdApiData => {
    const { jobberNormaltTimer } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined) {
        throw new Error('mapArbeidsforholdToApiData');
    }

    const periodeFortid = getHistoriskPeriode(søknadsperiode, søknadsdato);
    const periodeFremtid = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    const søkerFortid = periodeFortid !== undefined;
    const søkerFremtid = periodeFremtid !== undefined;

    return {
        _type: type,
        jobberNormaltTimer: jobberNormaltTimerNumber,
        historiskArbeid: getHistoriskArbeidIArbeidsforhold({
            søkerFremtid,
            søkerFortid,
            historiskPeriode: periodeFortid,
            arbeidHistoriskPeriode: arbeidsforhold.historisk,
            arbeidsperiode,
            jobberNormaltTimerNumber,
        }),
        planlagtArbeid: getPlanlagtArbeidIArbeidsforhold({
            søkerFremtid,
            søkerFortid,
            planlagtPeriode: periodeFremtid,
            arbeidPlanlagtPeriode: arbeidsforhold.planlagt,
            arbeidsperiode,
            jobberNormaltTimerNumber,
        }),
    };
};
