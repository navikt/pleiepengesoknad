import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { removeDurationWeekdaysWithNoDuration } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidFormData } from '../../../types/ArbeidsforholdFormData';

export const cleanupNormalarbeidstid = (
    {
        erLikeMangeTimerHverUke,
        timerFasteUkedager,
        erFasteUkedager,
        timerPerUke,
        arbeiderFastHelg,
        arbeiderHeltid,
    }: NormalarbeidstidFormData,
    erFrilanserEllerSN: boolean /** Skal kun oppgi informasjon om timer i uken */
): NormalarbeidstidFormData => {
    if (erFrilanserEllerSN) {
        return {
            erLikeMangeTimerHverUke: YesOrNo.YES,
            timerPerUke,
        };
    }
    if (arbeiderHeltid === YesOrNo.NO) {
        return {
            arbeiderHeltid,
            timerPerUke,
        };
    }
    if (arbeiderFastHelg === YesOrNo.YES) {
        return {
            arbeiderHeltid,
            arbeiderFastHelg,
            timerPerUke,
        };
    }
    if (erLikeMangeTimerHverUke === YesOrNo.NO) {
        return {
            arbeiderHeltid,
            arbeiderFastHelg,
            erLikeMangeTimerHverUke,
            timerPerUke,
        };
    }
    if (erFasteUkedager === YesOrNo.YES) {
        return {
            arbeiderHeltid,
            arbeiderFastHelg,
            erLikeMangeTimerHverUke,
            erFasteUkedager,
            timerFasteUkedager: timerFasteUkedager
                ? removeDurationWeekdaysWithNoDuration(timerFasteUkedager)
                : undefined,
        };
    }
    return {
        arbeiderHeltid,
        arbeiderFastHelg,
        erLikeMangeTimerHverUke,
        erFasteUkedager,
        timerPerUke,
    };
};
