import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../types/PleiepengesøknadApiData';
import { ArbeidIPeriode, Arbeidsforhold } from '../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../tidsbrukUtils';
import { getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

export const mapArbeidIPeriodeToApiData = (arbeid: ArbeidIPeriode, periode: DateRange): ArbeidIPeriodeApiData => {
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
    return {
        jobberIPerioden: JobberIPeriodeSvar.JA,
        jobberSomVanlig: false,
        erLiktHverUke,
        enkeltdager:
            arbeid.enkeltdager && !erLiktHverUke
                ? getEnkeltdagerIPeriodeApiData(arbeid.enkeltdager, periode)
                : undefined,
        fasteDager: arbeid.fasteDager && erLiktHverUke ? getFasteDagerApiData(arbeid.fasteDager) : undefined,
    };
};

export const getHistoriskArbeidIArbeidsforhold = ({
    søkerFortid,
    søkerFremtid,
    arbeidHistoriskPeriode,
    historiskPeriode,
}: {
    søkerFremtid: boolean;
    søkerFortid: boolean;
    historiskPeriode?: DateRange;
    arbeidHistoriskPeriode?: ArbeidIPeriode;
}): ArbeidIPeriodeApiData | undefined => {
    if (søkerFremtid && !søkerFortid) {
        return undefined;
    }
    return historiskPeriode && arbeidHistoriskPeriode
        ? mapArbeidIPeriodeToApiData(arbeidHistoriskPeriode, historiskPeriode)
        : undefined;
};

export const getPlanlagtArbeidIArbeidsforhold = ({
    søkerFortid,
    søkerFremtid,
    arbeidPlanlagtPeriode,
    planlagtPeriode,
}: {
    søkerFremtid: boolean;
    søkerFortid: boolean;
    planlagtPeriode?: DateRange;
    arbeidPlanlagtPeriode?: ArbeidIPeriode;
}): ArbeidIPeriodeApiData | undefined => {
    if (søkerFortid && !søkerFremtid) {
        return undefined;
    }
    return planlagtPeriode && arbeidPlanlagtPeriode
        ? mapArbeidIPeriodeToApiData(arbeidPlanlagtPeriode, planlagtPeriode)
        : undefined;
};

export const mapArbeidsforholdToApiData = (
    arbeidsforhold: Arbeidsforhold,
    søknadsperiode: DateRange,
    type: ArbeidsforholdType,
    søknadsdato: Date
): ArbeidsforholdApiData => {
    const { jobberNormaltTimer, arbeidsform } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined || arbeidsform === undefined) {
        throw new Error('mapArbeidsforholdToApiData');
    }

    const periodeFortid = getHistoriskPeriode(søknadsperiode, søknadsdato);
    const periodeFremtid = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    const søkerFortid = periodeFortid !== undefined;
    const søkerFremtid = periodeFremtid !== undefined;

    return {
        _type: type,
        jobberNormaltTimer: jobberNormaltTimerNumber,
        arbeidsform,
        historiskArbeid: getHistoriskArbeidIArbeidsforhold({
            søkerFremtid,
            søkerFortid,
            historiskPeriode: periodeFortid,
            arbeidHistoriskPeriode: arbeidsforhold.historisk,
        }),
        planlagtArbeid: getPlanlagtArbeidIArbeidsforhold({
            søkerFremtid,
            søkerFortid,
            planlagtPeriode: periodeFremtid,
            arbeidPlanlagtPeriode: arbeidsforhold.planlagt,
        }),
    };
};
