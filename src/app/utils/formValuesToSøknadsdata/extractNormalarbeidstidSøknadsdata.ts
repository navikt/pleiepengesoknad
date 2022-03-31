import { getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { durationToDecimalDuration, summarizeDateDurationMap } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';
import { durationWeekdaysFromHoursPerWeek } from '../durationWeekdaysUtils';

export const extractNormalarbeidstid = (
    normalarbeidstid?: NormalarbeidstidFormData
): NormalarbeidstidSøknadsdata | undefined => {
    if (!normalarbeidstid || isYesOrNoAnswered(normalarbeidstid.erLiktHverUke) === false) {
        return undefined;
    }
    if (normalarbeidstid.erLiktHverUke === YesOrNo.YES) {
        const timerPerUke = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        if (normalarbeidstid.liktHverDag && timerPerUke !== undefined) {
            return {
                type: 'likeDagerHverUke',
                erLiktHverUke: true,
                erLiktHverDag: true,
                fasteDager: durationWeekdaysFromHoursPerWeek(timerPerUke),
                timerPerUke: timerPerUke,
            };
        }
        if (normalarbeidstid.liktHverDag === YesOrNo.NO && normalarbeidstid.fasteDager) {
            return {
                type: 'ulikeDagerHverUke',
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
                type: 'ulikeUker',
                erLiktHverUke: false,
                timerPerUke,
                fasteDager: durationWeekdaysFromHoursPerWeek(timerPerUke),
            };
        }
    }
    throw 'extractNormalarbeidstid failed';
};
