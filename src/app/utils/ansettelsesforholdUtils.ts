import { AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { YesOrNo } from 'app/types/YesOrNo';
import { timeToDecimalTime, decimalTimeToTime, timeToString } from './timeUtils';
import { HoursOrPercent } from 'app/types/Søkerdata';
import { InjectedIntl } from 'react-intl';
import intlHelper from './intlUtils';
import { Time } from 'app/types/Time';

export const getRedusertTidForAnsettelsesforhold = ({
    timer_normalt,
    timer_redusert,
    prosent_redusert,
    pstEllerTimer
}: AnsettelsesforholdForm): Time | undefined => {
    if (!timer_normalt) {
        return undefined;
    }
    if (pstEllerTimer === HoursOrPercent.hours && timer_redusert !== undefined) {
        return timer_redusert;
    }
    if (pstEllerTimer === HoursOrPercent.percent && prosent_redusert !== undefined) {
        return calculateArbeidstimerFraProsent(timer_normalt, prosent_redusert);
    }
    return undefined;
};

export const calculateArbeidstimerFraProsent = (normal: Time, prosentRedusert: number): Time => {
    const hoursNormalt = timeToDecimalTime(normal);
    const hoursReduced = (hoursNormalt / 100) * prosentRedusert;
    return decimalTimeToTime(hoursReduced);
};

export const calculateRedusertArbeidsukeprosent = (normal: Time, redusert: Time | undefined): number => {
    if (redusert === undefined) {
        return 100;
    }
    const hoursNormalt = timeToDecimalTime(normal);
    const hoursRedusert = timeToDecimalTime(redusert);
    const reducedHours = (hoursNormalt / 100) * hoursRedusert;
    return parseFloat(reducedHours.toFixed(2));
};

export const getIntlAnsettelsesforholdsdetaljerForSummary = (
    forhold: AnsettelsesforholdForm,
    intl: InjectedIntl
): string | undefined => {
    const { timer_normalt, timer_redusert, prosent_redusert, pstEllerTimer, skalArbeide } = forhold;

    if (skalArbeide === YesOrNo.NO && timer_normalt !== undefined) {
        return intlHelper(intl, 'gradertAnsettelsesforhold.oppsummering.skalIkkeArbeide', {
            timerNormalt: timeToString(timer_normalt, intl)
        });
    }

    if (!pstEllerTimer || !timer_normalt || (!timer_redusert && !prosent_redusert)) {
        return undefined;
    }

    const timerRedusert =
        timer_redusert !== undefined && pstEllerTimer === HoursOrPercent.hours
            ? timer_redusert
            : calculateArbeidstimerFraProsent(timer_normalt, prosent_redusert!);

    return intlHelper(
        intl,
        pstEllerTimer === HoursOrPercent.hours
            ? 'gradertAnsettelsesforhold.oppsummering.skalArbeideDelvis'
            : 'gradertAnsettelsesforhold.oppsummering.skalArbeideDelvis',
        {
            navn: forhold.navn,
            organisasjonsnummer: forhold.organisasjonsnummer,
            timerNormalt: timeToString(timer_normalt, intl),
            timerRedusert: timeToString(timerRedusert, intl)
        }
    );
};
