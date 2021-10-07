import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType, JobberIPeriodeSvar } from '../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../types/PleiepengesøknadApiData';
import { ArbeidIPeriode, Arbeidsforhold } from '../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import {
    getEnkeltdagerIPeriodeApiData,
    getFasteDagerApiData,
    getHistoriskPeriode,
    getPlanlagtPeriode,
} from '../tidsbrukUtils';

export const mapArbeidIPeriodeToApiData = (arbeid: ArbeidIPeriode, periode: DateRange): ArbeidIPeriodeApiData => {
    return {
        jobberIPerioden: arbeid.jobberIPerioden,
        jobberSomVanlig: isYesOrNoAnswered(arbeid.jobberSomVanlig) ? arbeid.jobberSomVanlig === YesOrNo.YES : undefined,
        erLiktHverUke: isYesOrNoAnswered(arbeid.erLiktHverUke) ? arbeid.erLiktHverUke === YesOrNo.YES : undefined,
        enkeltdager:
            arbeid.enkeltdager && arbeid.erLiktHverUke !== YesOrNo.YES
                ? getEnkeltdagerIPeriodeApiData(arbeid.enkeltdager, periode)
                : undefined,
        fasteDager:
            arbeid.fasteDager && arbeid.erLiktHverUke === YesOrNo.YES
                ? getFasteDagerApiData(arbeid.fasteDager)
                : undefined,
    };
};

export const getHistoriskArbeidIArbeidsforhold = ({
    søkerHistorisk,
    søkerPlanlagt,
    arbeidHistoriskPeriode,
    historiskPeriode,
}: {
    søkerPlanlagt: boolean;
    søkerHistorisk: boolean;
    historiskPeriode?: DateRange;
    arbeidHistoriskPeriode?: ArbeidIPeriode;
}): ArbeidIPeriodeApiData | undefined => {
    if (søkerPlanlagt && !søkerHistorisk) {
        return undefined;
    }
    return historiskPeriode && arbeidHistoriskPeriode
        ? mapArbeidIPeriodeToApiData(arbeidHistoriskPeriode, historiskPeriode)
        : { jobberIPerioden: JobberIPeriodeSvar.NEI };
};

export const getPlanlagtArbeidIArbeidsforhold = ({
    søkerHistorisk,
    søkerPlanlagt,
    arbeidPlanlagtPeriode,
    planlagtPeriode,
}: {
    søkerPlanlagt: boolean;
    søkerHistorisk: boolean;
    planlagtPeriode?: DateRange;
    arbeidPlanlagtPeriode?: ArbeidIPeriode;
}): ArbeidIPeriodeApiData | undefined => {
    if (søkerHistorisk && !søkerPlanlagt) {
        return undefined;
    }
    return planlagtPeriode && arbeidPlanlagtPeriode
        ? mapArbeidIPeriodeToApiData(arbeidPlanlagtPeriode, planlagtPeriode)
        : { jobberIPerioden: JobberIPeriodeSvar.NEI };
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

    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, søknadsdato);
    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    const søkerHistorisk = periodeFørSøknadsdato !== undefined;
    const søkerPlanlagt = periodeFraOgMedSøknadsdato !== undefined;

    return {
        _type: type,
        jobberNormaltTimer: jobberNormaltTimerNumber,
        arbeidsform,
        historiskArbeid: getHistoriskArbeidIArbeidsforhold({
            søkerPlanlagt,
            søkerHistorisk,
            historiskPeriode: periodeFørSøknadsdato,
            arbeidHistoriskPeriode: arbeidsforhold.historisk,
        }),
        planlagtArbeid: getPlanlagtArbeidIArbeidsforhold({
            søkerPlanlagt,
            søkerHistorisk,
            planlagtPeriode: periodeFraOgMedSøknadsdato,
            arbeidPlanlagtPeriode: arbeidsforhold.planlagt,
        }),
    };
};
