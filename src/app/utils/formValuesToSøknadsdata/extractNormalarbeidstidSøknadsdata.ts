import { getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { durationToDecimalDuration, summarizeDateDurationMap } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { durationWeekdaysFromEqualHoursPerDay, durationWeekdaysFromHoursPerWeek } from '../durationWeekdaysUtils';

export const extractNormalarbeidstid = (
    normalarbeidstid?: NormalarbeidstidFormData
): NormalarbeidstidSøknadsdata | undefined => {
    if (!normalarbeidstid || isYesOrNoAnswered(normalarbeidstid.erLiktHverUke) === false) {
        return undefined;
    }
    if (normalarbeidstid.erLiktHverUke === YesOrNo.YES) {
        const timerPerDag = getNumberFromNumberInputValue(normalarbeidstid.timerPerDag);
        if (normalarbeidstid.liktHverDag && timerPerDag !== undefined) {
            return {
                erLiktHverUke: true,
                erLiktHverDag: true,
                timerPerDag,
                fasteDager: durationWeekdaysFromEqualHoursPerDay(timerPerDag),
                timerPerUke: timerPerDag * 5,
            };
        }
        if (normalarbeidstid.liktHverDag === YesOrNo.NO && normalarbeidstid.fasteDager) {
            return {
                erLiktHverUke: true,
                erLiktHverDag: false,
                fasteDager: normalarbeidstid.fasteDager,
                timerPerUke: durationToDecimalDuration(summarizeDateDurationMap(normalarbeidstid.fasteDager)),
            };
        }
    }
    if (normalarbeidstid.erLiktHverUke === YesOrNo.NO) {
        const timerPerUke = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        if (timerPerUke !== undefined) {
            return {
                erLiktHverUke: false,
                timerPerUke,
                fasteDager: durationWeekdaysFromHoursPerWeek(timerPerUke),
            };
        }
    }
    return undefined;
};
