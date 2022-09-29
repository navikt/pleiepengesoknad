import { getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata, NormalarbeidstidType } from '../../types/søknadsdata/Søknadsdata';
import { isYesOrNoAnswered } from '../../validation/fieldValidations';

export const ExtractNormalarbeidstidFailed = 'ExtractNormalarbeidstid failed';

export const extractNormalarbeidstid = (
    normalarbeidstid: NormalarbeidstidFormData | undefined,
    arbeidsforholdType: ArbeidsforholdType
): NormalarbeidstidSøknadsdata | undefined => {
    if (!normalarbeidstid) {
        return undefined;
    }
    if (
        arbeidsforholdType === ArbeidsforholdType.ANSATT &&
        normalarbeidstid.erEndretSidenForrigeSøknad === YesOrNo.NO
    ) {
        const timerPerUkeISnitt = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        if (timerPerUkeISnitt === undefined) {
            return undefined;
        }

        return normalarbeidstid.erEndretSidenForrigeSøknad === YesOrNo.NO
            ? {
                  type: NormalarbeidstidType.erLiktSnittSomForrigeSøknad,
                  erLiktHverUke: false,
                  timerPerUkeISnitt,
              }
            : {
                  type: NormalarbeidstidType.ulikeUker,
                  erLiktHverUke: false,
                  erFasteUkedager: false,
                  timerPerUkeISnitt,
              };
    }
    if (
        arbeidsforholdType === ArbeidsforholdType.ANSATT &&
        isYesOrNoAnswered(normalarbeidstid.arbeiderHeltid) === false
    ) {
        return undefined;
    }
    if (arbeidsforholdType === ArbeidsforholdType.FRILANSER || arbeidsforholdType === ArbeidsforholdType.SELVSTENDIG) {
        const timerPerUkeISnitt = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        return timerPerUkeISnitt !== undefined
            ? {
                  type: NormalarbeidstidType.ulikeUker,
                  erLiktHverUke: false,
                  erFasteUkedager: false,
                  timerPerUkeISnitt: timerPerUkeISnitt,
              }
            : undefined;
    }
    if (normalarbeidstid.arbeiderHeltid === YesOrNo.NO) {
        const timerPerUkeISnitt = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        return timerPerUkeISnitt !== undefined
            ? {
                  type: NormalarbeidstidType.arbeiderDeltid,
                  erLiktHverUke: false,
                  erFasteUkedager: false,
                  timerPerUkeISnitt: timerPerUkeISnitt,
              }
            : undefined;
    }
    if (normalarbeidstid.arbeiderFastHelg === YesOrNo.YES) {
        const timerPerUkeISnitt = getNumberFromNumberInputValue(normalarbeidstid.timerPerUke);
        return timerPerUkeISnitt !== undefined
            ? {
                  type: NormalarbeidstidType.arbeiderHelg,
                  erLiktHverUke: false,
                  erFasteUkedager: false,
                  timerPerUkeISnitt: timerPerUkeISnitt,
              }
            : undefined;
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
                type: NormalarbeidstidType.ulikeUker,
                erLiktHverUke: false,
                erFasteUkedager: false,
                timerPerUkeISnitt: timerPerUke,
            };
        }
    }
    return undefined;
};
