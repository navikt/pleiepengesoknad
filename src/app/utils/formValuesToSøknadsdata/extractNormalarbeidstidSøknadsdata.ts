import { getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata, NormalarbeidstidType } from '../../types/Søknadsdata';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';

export const ExtractNormalarbeidstidFailed = 'ExtractNormalarbeidstid failed';

export const extractNormalarbeidstid = (
    normalarbeidstid?: NormalarbeidstidFormData
): NormalarbeidstidSøknadsdata | undefined => {
    if (!normalarbeidstid || isYesOrNoAnswered(normalarbeidstid.erLikeMangeTimerHverUke) === false) {
        return undefined;
    }
    if (normalarbeidstid.erLikeMangeTimerHverUke === YesOrNo.YES) {
        const timerPerUke = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        if (normalarbeidstid.erFasteUkedager === YesOrNo.YES && normalarbeidstid.timerFasteUkedager) {
            return {
                type: NormalarbeidstidType.likeUkerOgDager,
                erLiktHverUke: true,
                erFasteUkedager: true,
                timerFasteUkedager: normalarbeidstid.timerFasteUkedager,
            };
        }
        if (normalarbeidstid.erFasteUkedager === YesOrNo.NO && timerPerUke) {
            return {
                type: NormalarbeidstidType.likeUkerVarierendeDager,
                erLiktHverUke: true,
                erFasteUkedager: false,
                timerPerUkeISnitt: timerPerUke,
            };
        }
    }
    if (normalarbeidstid.erLikeMangeTimerHverUke === YesOrNo.NO) {
        const timerPerUke = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        if (timerPerUke !== undefined) {
            return {
                type: NormalarbeidstidType.varierendeUker,
                erLiktHverUke: false,
                erFasteUkedager: false,
                timerPerUkeISnitt: timerPerUke,
            };
        }
    }
    return undefined;
    // throw ExtractNormalarbeidstidFailed;
};
