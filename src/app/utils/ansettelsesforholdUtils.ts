import { HoursOrPercent } from 'app/types/Søkerdata';
import { AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { YesOrNo } from 'app/types/YesOrNo';

export const calculateRedusertArbeidsuke = (
    normal: number,
    redusert: number,
    pstEllerTimer: HoursOrPercent
): number => {
    if (pstEllerTimer === HoursOrPercent.hours) {
        return redusert;
    }
    const reducedHours = (normal / 100) * redusert;
    return parseFloat(reducedHours.toFixed(2));
};

export const getIntlAnsettelsesforholdsdetaljerForSummary = (
    forhold: AnsettelsesforholdForm
): { id: string; values?: any } | undefined => {
    const { normal_arbeidsuke, pstEllerTimer, redusert_arbeidsuke, skalArbeide } = forhold;
    if (skalArbeide === YesOrNo.NO) {
        return {
            id: 'gradertArbeidsforhold.oppsummering.skalIkkeArbeide',
            values: { timerNormalt: normal_arbeidsuke }
        };
    }
    if (!pstEllerTimer || !normal_arbeidsuke || !redusert_arbeidsuke) {
        return { id: 'steg.oppsummering.arbeidsforhold.forhold' };
    }

    const timerRedusert = calculateRedusertArbeidsuke(normal_arbeidsuke, redusert_arbeidsuke, pstEllerTimer);
    return {
        id: 'gradertArbeidsforhold.oppsummering.skalArbeideDelvis',
        values: { timerNormalt: normal_arbeidsuke, timerRedusert }
    };
};
