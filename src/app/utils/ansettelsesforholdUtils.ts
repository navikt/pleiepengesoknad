import { AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { YesOrNo } from 'app/types/YesOrNo';
import { getDecimalTimeFromTime, convertHoursToHoursAndMinutes, timeToString } from './timeUtils';
import { Time } from 'app/components/time-input-base/TimeInputBase';
import { HoursOrPercent } from 'app/types/Søkerdata';
import { InjectedIntl } from 'react-intl';
import intlHelper from './intlUtils';

export const calculateArbeidstimerFraProsent = (normal: Time, redusert: number): Time => {
    const hoursNormalt = getDecimalTimeFromTime(normal);
    const hoursReduced = (hoursNormalt / 100) * redusert;
    return convertHoursToHoursAndMinutes(hoursReduced);
};

export const calculateRedusertArbeidsukeprosent = (normal: Time, redusert: Time | undefined): number => {
    if (redusert === undefined) {
        return 100;
    }
    const hoursNormalt = getDecimalTimeFromTime(normal);
    const hoursRedusert = getDecimalTimeFromTime(redusert);
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
