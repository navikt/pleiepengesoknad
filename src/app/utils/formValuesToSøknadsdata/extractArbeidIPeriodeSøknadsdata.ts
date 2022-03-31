import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import {
    durationToDecimalDuration,
    DurationWeekdays,
    getDurationsInDateRange,
    summarizeDateDurationMap,
} from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeSøknadsdata, NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { getPercentageOfDurationWeekdays } from '../durationWeekdaysUtils';

const getFasteDaterUtFraFasteDagerNormaltOgTimerPerUke = (
    fasteDager: DurationWeekdays,
    timerPerUke: number
): DurationWeekdays => {
    const timerPerUkeNormalt = durationToDecimalDuration(summarizeDateDurationMap(fasteDager));
    const prosentAvNormalt = (timerPerUke / timerPerUkeNormalt) * 100;
    return getPercentageOfDurationWeekdays(prosentAvNormalt, fasteDager);
};

export const extractArbeidIPeriodeSøknadsdata = (
    {
        jobberIPerioden,
        enkeltdager,
        erLiktHverUke,
        fasteDager,
        jobberProsent,
        jobberTimer,
        timerEllerProsent,
    }: ArbeidIPeriodeFormData,
    normalarbeidstid: NormalarbeidstidSøknadsdata,
    søknadsperiode: DateRange
): ArbeidIPeriodeSøknadsdata | undefined => {
    const arbeiderIPerioden: boolean = jobberIPerioden === YesOrNo.YES;
    if (arbeiderIPerioden === false) {
        return {
            type: 'arbeiderIkkeIPerioden',
            arbeiderIPerioden: false,
        };
    }
    const arbeidstidErLikHverUke = erLiktHverUke === YesOrNo.YES;
    if (arbeidstidErLikHverUke) {
        const arbeiderProsent =
            timerEllerProsent === TimerEllerProsent.PROSENT ? getNumberFromNumberInputValue(jobberProsent) : undefined;
        const arbeiderTimer =
            timerEllerProsent === TimerEllerProsent.TIMER ? getNumberFromNumberInputValue(jobberTimer) : undefined;

        if (fasteDager === undefined && arbeiderProsent !== undefined) {
            return {
                type: 'fastProsent',
                arbeiderIPerioden,
                erLiktHverUke: true,
                jobberProsent: arbeiderProsent,
                jobberTimerPerUke: (normalarbeidstid.timerPerUke / 100) * arbeiderProsent,
                fasteDager: getPercentageOfDurationWeekdays(arbeiderProsent, normalarbeidstid.fasteDager),
            };
        }
        if (fasteDager === undefined && arbeiderTimer !== undefined) {
            return {
                type: 'fastTimer',
                arbeiderIPerioden,
                erLiktHverUke: true,
                jobberTimerPerUke: arbeiderTimer,
                fasteDager: getFasteDaterUtFraFasteDagerNormaltOgTimerPerUke(
                    normalarbeidstid.fasteDager,
                    arbeiderTimer
                ),
            };
        }
        if (fasteDager !== undefined && arbeiderProsent === undefined) {
            return {
                type: 'fasteDager',
                arbeiderIPerioden: arbeiderIPerioden,
                erLiktHverUke: arbeidstidErLikHverUke,
                fasteDager,
            };
        }
        if (fasteDager !== undefined && arbeiderProsent === undefined) {
            return {
                type: 'fasteDager',
                arbeiderIPerioden: arbeiderIPerioden,
                erLiktHverUke: arbeidstidErLikHverUke,
                fasteDager,
            };
        }
        return undefined;
    } else {
        if (enkeltdager) {
            return {
                type: 'variert',
                arbeiderIPerioden: arbeiderIPerioden,
                erLiktHverUke: false,
                enkeltdager: getDurationsInDateRange(enkeltdager, søknadsperiode),
            };
        }
        return undefined;
    }
};
