import { getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
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
                type: 'likeUkerFasteDager',
                erLiktHverUke: true,
                erFasteUkedager: true,
                timerFasteUkedager: normalarbeidstid.timerFasteUkedager,
            };
        }
        if (normalarbeidstid.erFasteUkedager === YesOrNo.NO && timerPerUke) {
            return {
                type: 'likeUkerUlikeDager',
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
                type: 'ulikeUker',
                erLiktHverUke: false,
                timerPerUkeISnitt: timerPerUke,
            };
        }
    }
    return undefined;
    // throw ExtractNormalarbeidstidFailed;
};
