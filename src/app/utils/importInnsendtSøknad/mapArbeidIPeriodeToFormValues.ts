import { DateRange, YesOrNo } from '@navikt/sif-common-formik/lib';
import { dateRangeToISODateRange, ISODateToDate, ISODurationToDecimalDuration } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormValues, ArbeidsukerFormValues } from '../../types/ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import {
    ArbeidIPeriodeApiData,
    ArbeidIPeriodeApiDataProsent,
    ArbeidIPeriodeApiDataTimerPerUke,
    ArbeidIPeriodeApiDataUlikeUkerTimer,
    ArbeidIPeriodeApiDataUlikeUkerProsent,
    ArbeidsukeTimerApiData,
    ArbeidsukeProsentApiData,
} from '../../types/søknad-api-data/arbeidIPeriodeApiData';

const sortArbeidsuke = (
    uke1: ArbeidsukeTimerApiData | ArbeidsukeProsentApiData,
    uke2: ArbeidsukeTimerApiData | ArbeidsukeProsentApiData
) => {
    return dayjs(uke1.periode.fraOgMed).isBefore(uke2.periode.fraOgMed) ? 1 : -1;
};

export const mapArbeidIPeriodeApiDataTimerPerUkeToFormValues = (
    arbeid: ArbeidIPeriodeApiDataTimerPerUke
): ArbeidIPeriodeFormValues => {
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.TIMER,
        erLiktHverUke: YesOrNo.YES,
        snittTimerPerUke: `${ISODurationToDecimalDuration(arbeid.timerPerUke)}`.replace('.', ','),
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
    const arbeidsuker: ArbeidsukerFormValues = {};
    arbeid.arbeidsuker.forEach(({ periode: { fraOgMed: from, tilOgMed: to }, prosentAvNormalt }) => {
        const periode: DateRange = { from: ISODateToDate(from), to: ISODateToDate(to) };
        arbeidsuker[dateRangeToISODateRange(periode)] = {
            prosentAvNormalt: prosentAvNormalt ? `${prosentAvNormalt}` : undefined,
        };
    });
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.TIMER,
        erLiktHverUke: YesOrNo.NO,
        arbeidsuker,
    };
};

export const mapArbeidIPeriodeApiDataUlikeUkerTimerToFormValues = (
    arbeid: ArbeidIPeriodeApiDataUlikeUkerTimer
): ArbeidIPeriodeFormValues => {
    const arbeidsuker: ArbeidsukerFormValues = {};
    arbeid.arbeidsuker.sort(sortArbeidsuke).forEach(({ periode: { fraOgMed: from, tilOgMed: to }, timer }) => {
        const periode: DateRange = { from: ISODateToDate(from), to: ISODateToDate(to) };
        arbeidsuker[dateRangeToISODateRange(periode)] = {
            snittTimerPerUke: timer ? `${timer}` : undefined,
        };
    });
    return {
        arbeiderIPerioden: arbeid.arbeiderIPerioden,
        timerEllerProsent: TimerEllerProsent.TIMER,
        erLiktHverUke: YesOrNo.NO,
        arbeidsuker,
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
