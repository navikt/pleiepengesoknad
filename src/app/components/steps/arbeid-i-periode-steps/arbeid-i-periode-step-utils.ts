import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { JobberIPeriodeSvar } from '../../../types';
import {
    ArbeidIPeriode,
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSNF,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';

const cleanupArbeidIPeriode = (arbeidIPerioden: ArbeidIPeriode): ArbeidIPeriode => {
    const arbeid: ArbeidIPeriode = {
        jobberIPerioden: arbeidIPerioden.jobberIPerioden,
    };
    if (arbeid.jobberIPerioden !== JobberIPeriodeSvar.JA) {
        return arbeid;
    }

    arbeid.jobberSomVanlig = arbeidIPerioden.jobberSomVanlig;
    if (arbeid.jobberSomVanlig === YesOrNo.YES) {
        return arbeid;
    }

    arbeid.erLiktHverUke = arbeidIPerioden.erLiktHverUke;
    if (arbeidIPerioden.erLiktHverUke === YesOrNo.YES) {
        arbeid.fasteDager = arbeidIPerioden.fasteDager;
        return arbeid;
    }
    if (arbeidIPerioden.erLiktHverUke === YesOrNo.NO) {
        arbeid.enkeltdager = arbeidIPerioden.enkeltdager;
        return arbeid;
    }
    return arbeidIPerioden;
};

const cleanupArbeidsforhold = (arbeidsforhold: Arbeidsforhold, erHistorisk: boolean): Arbeidsforhold => {
    if (erHistorisk && arbeidsforhold.historisk) {
        return {
            ...arbeidsforhold,
            historisk: cleanupArbeidIPeriode(arbeidsforhold.historisk),
        };
    }
    if (erHistorisk === false && arbeidsforhold.planlagt) {
        return {
            ...arbeidsforhold,
            planlagt: cleanupArbeidIPeriode(arbeidsforhold.planlagt),
        };
    }
    return arbeidsforhold;
};

export const cleanupArbeidIPeriodeStepData = (
    formData: PleiepengesøknadFormData,
    erHistorisk: boolean
): PleiepengesøknadFormData => {
    const values: PleiepengesøknadFormData = { ...formData };
    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(
        (arbeidsforhold) => cleanupArbeidsforhold(arbeidsforhold, erHistorisk) as ArbeidsforholdAnsatt
    );
    values.frilans_arbeidsforhold = values.frilans_arbeidsforhold
        ? (cleanupArbeidsforhold(values.frilans_arbeidsforhold, erHistorisk) as ArbeidsforholdSNF)
        : undefined;
    values.selvstendig_arbeidsforhold = values.selvstendig_arbeidsforhold
        ? (cleanupArbeidsforhold(values.selvstendig_arbeidsforhold, erHistorisk) as ArbeidsforholdSNF)
        : undefined;
    return values;
};
