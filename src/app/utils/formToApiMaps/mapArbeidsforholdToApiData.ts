import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../types/PleiepengesøknadApiData';
import { ArbeidIPeriode, Arbeidsforhold } from '../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../tidsbrukUtils';
import { fjernTidUtenforPeriode, getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

export const mapArbeidIPeriodeToApiData = (
    arbeid: ArbeidIPeriode,
    periode: DateRange,
    /** Periode hvor en er aktiv og som kan påvirke dager innenfor perioden, f.eks. noen som starter/slutter i periode */
    arbeidsperiode?: Partial<DateRange>
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
}: {
    søkerFremtid: boolean;
    søkerFortid: boolean;
    historiskPeriode?: DateRange;
    arbeidHistoriskPeriode?: ArbeidIPeriode;
    arbeidsperiode?: Partial<DateRange>;
}): ArbeidIPeriodeApiData | undefined => {
    if (søkerFremtid && !søkerFortid) {
        return undefined;
    }
    return historiskPeriode && arbeidHistoriskPeriode
        ? mapArbeidIPeriodeToApiData(arbeidHistoriskPeriode, historiskPeriode, arbeidsperiode)
        : undefined;
};

export const getPlanlagtArbeidIArbeidsforhold = ({
    søkerFortid,
    søkerFremtid,
    arbeidPlanlagtPeriode,
    planlagtPeriode,
    arbeidsperiode,
}: {
    søkerFremtid: boolean;
    søkerFortid: boolean;
    planlagtPeriode?: DateRange;
    arbeidPlanlagtPeriode?: ArbeidIPeriode;
    arbeidsperiode?: Partial<DateRange>;
}): ArbeidIPeriodeApiData | undefined => {
    if (søkerFortid && !søkerFremtid) {
        return undefined;
    }
    return planlagtPeriode && arbeidPlanlagtPeriode
        ? mapArbeidIPeriodeToApiData(arbeidPlanlagtPeriode, planlagtPeriode, arbeidsperiode)
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
        }),
        planlagtArbeid: getPlanlagtArbeidIArbeidsforhold({
            søkerFremtid,
            søkerFortid,
            planlagtPeriode: periodeFremtid,
            arbeidPlanlagtPeriode: arbeidsforhold.planlagt,
            arbeidsperiode,
        }),
    };
};
