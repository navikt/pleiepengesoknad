import { ISODurationToDecimalDuration } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import {
    ArbeidIPeriodeApiData,
    ArbeidIPeriodeApiDataProsent,
    ArbeidIPeriodeApiDataTimerPerUke,
} from '../../types/søknad-api-data/arbeidIPeriodeApiData';

export const mapArbeidIPeriodeApiDataTimerPerUkeToFormValues = (
    arbeid: ArbeidIPeriodeApiDataTimerPerUke
): ArbeidIPeriodeFormData => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.TIMER,
        timerPerUke: `${ISODurationToDecimalDuration(arbeid.timerPerUke)}`.replace('.', ','),
    };
};

export const mapArbeidIPeriodeApiDataProsentToFormValues = (
    arbeid: ArbeidIPeriodeApiDataProsent
): ArbeidIPeriodeFormData => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.PROSENT,
        prosentAvNormalt: `${arbeid.prosentAvNormalt}`.replace('.', ','),
    };
};

export const mapArbeidIPeriodeApiDataToFormValues = (
    arbeid?: ArbeidIPeriodeApiData
): ArbeidIPeriodeFormData | undefined => {
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
    }
};
