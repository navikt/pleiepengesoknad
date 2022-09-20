import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidSøknadsdata, NormalarbeidstidType } from '../../types/søknadsdata/normalarbeidstidSøknadsdata';

const numberToInputString = (value: number) => {
    return `${value}`.replace('.', ',');
};

export const getNormalarbeidstidFormValues = (
    normalarbeidstid: NormalarbeidstidSøknadsdata
): NormalarbeidstidFormData => {
    switch (normalarbeidstid.type) {
        case NormalarbeidstidType.arbeiderDeltid:
            return {
                arbeiderHeltid: YesOrNo.NO,
                timerPerUke: numberToInputString(normalarbeidstid.timerPerUkeISnitt),
            };
        case NormalarbeidstidType.arbeiderHelg:
            return {
                arbeiderHeltid: YesOrNo.YES,
                arbeiderFastHelg: YesOrNo.YES,
                timerPerUke: numberToInputString(normalarbeidstid.timerPerUkeISnitt),
            };
        case NormalarbeidstidType.ulikeUker:
            return {
                arbeiderHeltid: YesOrNo.YES,
                arbeiderFastHelg: YesOrNo.NO,
                erLikeMangeTimerHverUke: YesOrNo.NO,
                timerPerUke: numberToInputString(normalarbeidstid.timerPerUkeISnitt),
            };

        case NormalarbeidstidType.likeUkerVarierendeDager:
            return {
                arbeiderHeltid: YesOrNo.YES,
                arbeiderFastHelg: YesOrNo.NO,
                erLikeMangeTimerHverUke: YesOrNo.NO,
                erFasteUkedager: YesOrNo.NO,
                timerPerUke: numberToInputString(normalarbeidstid.timerPerUkeISnitt),
            };
        case NormalarbeidstidType.likeUkerOgDager:
            return {
                arbeiderHeltid: YesOrNo.YES,
                arbeiderFastHelg: YesOrNo.NO,
                erLikeMangeTimerHverUke: YesOrNo.NO,
                erFasteUkedager: YesOrNo.YES,
                timerFasteUkedager: normalarbeidstid.timerFasteUkedager,
            };
    }
};
