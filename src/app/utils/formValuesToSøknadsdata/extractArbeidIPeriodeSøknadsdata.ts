import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getDurationsInDateRange } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeiderIPeriodenSvar, ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeSøknadsdata, ArbeidIPeriodeType } from '../../types/Søknadsdata';

export const extractArbeidIPeriodeSøknadsdata = (
    {
        arbeiderIPerioden,
        enkeltdager,
        erLiktHverUke,
        fasteDager,
        prosentAvNormalt,
        timerPerUke,
        timerEllerProsent,
    }: ArbeidIPeriodeFormData,
    søknadsperiode: DateRange
): ArbeidIPeriodeSøknadsdata | undefined => {
    if (arbeiderIPerioden === ArbeiderIPeriodenSvar.heltFravær) {
        return {
            type: ArbeidIPeriodeType.arbeiderIkke,
            arbeiderIPerioden: false,
        };
    }
    if (arbeiderIPerioden === ArbeiderIPeriodenSvar.somVanlig) {
        return {
            type: ArbeidIPeriodeType.arbeiderVanlig,
            arbeiderIPerioden: true,
            arbeiderRedusert: false,
        };
    }

    const arbeiderProsent =
        timerEllerProsent === TimerEllerProsent.PROSENT ? getNumberFromNumberInputValue(prosentAvNormalt) : undefined;
    const timerISnittPerUke =
        timerEllerProsent === TimerEllerProsent.TIMER ? getNumberFromNumberInputValue(timerPerUke) : undefined;

    if (erLiktHverUke === YesOrNo.YES) {
        if (fasteDager === undefined && arbeiderProsent !== undefined) {
            return {
                type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                prosentAvNormalt: arbeiderProsent,
            };
        }
        if (fasteDager === undefined && timerISnittPerUke !== undefined) {
            return {
                type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                timerISnittPerUke: timerISnittPerUke,
            };
        }
        if (fasteDager !== undefined && arbeiderProsent === undefined) {
            return {
                type: ArbeidIPeriodeType.arbeiderFasteUkedager,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                fasteDager,
            };
        }
        if (fasteDager !== undefined && arbeiderProsent === undefined) {
            return {
                type: ArbeidIPeriodeType.arbeiderFasteUkedager,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                fasteDager,
            };
        }
    } else {
        if (enkeltdager) {
            return {
                type: ArbeidIPeriodeType.arbeiderEnkeltdager,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                enkeltdager: getDurationsInDateRange(enkeltdager, søknadsperiode),
            };
        }
        if (timerPerUke && timerISnittPerUke) {
            return {
                type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                timerISnittPerUke,
            };
        }
        if (arbeiderProsent && prosentAvNormalt) {
            return {
                type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                prosentAvNormalt: arbeiderProsent,
            };
        }
    }
    return undefined;
};
