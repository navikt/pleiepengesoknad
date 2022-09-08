import { YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    DateDurationMap,
    ISODurationToDecimalDuration,
    ISODurationToMaybeDuration,
} from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import {
    ArbeidIPeriodeApiData,
    ArbeidIPeriodeApiDataFasteDager,
    ArbeidIPeriodeApiDataProsent,
    ArbeidIPeriodeApiDataTimerPerUke,
    ArbeidIPeriodeApiDataVariert,
} from '../../types/søknad-api-data/arbeidIPeriodeApiData';
import { mapTimerFasteDagerToDurationWeekdays } from './extractFormValuesUtils';

export const mapArbeidstidEnkeltdagerApiDataToFormValues = (
    arbeid: ArbeidIPeriodeApiDataVariert
): ArbeidIPeriodeFormData => {
    const enkeltdager: DateDurationMap = {};
    arbeid.enkeltdager.forEach((enkeltdag) => {
        const arbeidstid = ISODurationToMaybeDuration(enkeltdag.arbeidstimer.faktiskTimer);
        if (arbeidstid) {
            enkeltdager[enkeltdag.dato] = arbeidstid;
        }
    });
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        erLiktHverUke: YesOrNo.NO,
        enkeltdager,
    };
};

export const mapArbeidIPeriodeApiDataFasteDagerToFormValues = (
    arbeid: ArbeidIPeriodeApiDataFasteDager
): ArbeidIPeriodeFormData => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        erLiktHverUke: YesOrNo.YES,
        fasteDager: mapTimerFasteDagerToDurationWeekdays(arbeid.fasteDager),
    };
};

export const mapArbeidIPeriodeApiDataTimerPerUkeToFormValues = (
    arbeid: ArbeidIPeriodeApiDataTimerPerUke
): ArbeidIPeriodeFormData => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        erLiktHverUke: YesOrNo.YES,
        timerEllerProsent: TimerEllerProsent.TIMER,
        timerPerUke: `${ISODurationToDecimalDuration(arbeid.timerPerUke)}`.replace('.', ','),
    };
};

export const mapArbeidIPeriodeApiDataProsentToFormValues = (
    arbeid: ArbeidIPeriodeApiDataProsent
): ArbeidIPeriodeFormData => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        erLiktHverUke: YesOrNo.YES,
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
        case ArbeidIPeriodeType.arbeiderEnkeltdager:
            return mapArbeidstidEnkeltdagerApiDataToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderFasteUkedager:
            return mapArbeidIPeriodeApiDataFasteDagerToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
            return mapArbeidIPeriodeApiDataProsentToFormValues(arbeid);
        case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
            return mapArbeidIPeriodeApiDataTimerPerUkeToFormValues(arbeid);
    }
};
