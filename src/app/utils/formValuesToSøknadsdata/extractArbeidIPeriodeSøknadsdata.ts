import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getDurationsInDateRange } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormData, ArbeiderIPeriodenSvar } from '../../types/ArbeidIPeriodeFormData';
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
    const snittTimerPerUke =
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
        if (fasteDager === undefined && snittTimerPerUke !== undefined) {
            return {
                type: ArbeidIPeriodeType.arbeiderSnittTimerPerUke,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                snittTimerPerUke: snittTimerPerUke,
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
        if (timerPerUke && snittTimerPerUke) {
            return {
                type: ArbeidIPeriodeType.arbeiderSnittTimerPerUke,
                arbeiderIPerioden: true,
                arbeiderRedusert: true,
                snittTimerPerUke,
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
