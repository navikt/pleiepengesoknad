import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODurationToDecimalDuration } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormValues } from '../../types/ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import {
    ArbeidIPeriodeApiData,
    ArbeidIPeriodeApiDataProsent,
    ArbeidIPeriodeApiDataTimerPerUke,
    ArbeidIPeriodeApiDataUlikeUkerTimer,
    ArbeidIPeriodeApiDataUlikeUkerProsent,
} from '../../types/søknad-api-data/arbeidIPeriodeApiData';

export const mapArbeidIPeriodeApiDataTimerPerUkeToFormValues = (
    arbeid: ArbeidIPeriodeApiDataTimerPerUke
): ArbeidIPeriodeFormValues => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.TIMER,
        erLiktHverUke: YesOrNo.YES,
        snittTimerPerUke: `${ISODurationToDecimalDuration(arbeid.snittTimerPerUke)}`.replace('.', ','),
    };
};

export const mapArbeidIPeriodeApiDataProsentToFormValues = (
    arbeid: ArbeidIPeriodeApiDataProsent
): ArbeidIPeriodeFormValues => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.PROSENT,
        erLiktHverUke: YesOrNo.YES,
        prosentAvNormalt: `${arbeid.prosentAvNormalt}`.replace('.', ','),
    };
};

export const mapArbeidIPeriodeApiDataUlikeUkerProsentToFormValues = (
    arbeid: ArbeidIPeriodeApiDataUlikeUkerProsent
): ArbeidIPeriodeFormValues => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.TIMER,
        erLiktHverUke: YesOrNo.NO,
        arbeidsuker: {} /** TODO */,
    };
};

export const mapArbeidIPeriodeApiDataUlikeUkerTimerToFormValues = (
    arbeid: ArbeidIPeriodeApiDataUlikeUkerTimer
): ArbeidIPeriodeFormValues => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.TIMER,
        erLiktHverUke: YesOrNo.NO,
        arbeidsuker: {} /** TODO */,
    };
};

export const mapArbeidIPeriodeApiDataToFormValues = (
    arbeid?: ArbeidIPeriodeApiData
): ArbeidIPeriodeFormValues | undefined => {
    if (!arbeid) {
        return undefined;
    }
    switch (arbeid.type) {
        case ArbeidIPeriodeType.arbeiderIkke:
        case ArbeidIPeriodeType.arbeiderVanlig:
            return {
                arbeiderIPerioden: arbeid.arbeiderIPerioden,
            };
        case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
            return mapArbeidIPeriodeApiDataProsentToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
            return mapArbeidIPeriodeApiDataTimerPerUkeToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderUlikeUkerProsent:
            return mapArbeidIPeriodeApiDataUlikeUkerProsentToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderUlikeUkerTimer:
            return mapArbeidIPeriodeApiDataUlikeUkerTimerToFormValues(arbeid);
    }
};
