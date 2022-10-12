import { DateRange, getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { dateUtils } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormValues } from '../../types/ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import { ArbeidIPeriodeSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const getMinDateRangeFromDateRanges = (dr1: DateRange, dr2: DateRange): DateRange => ({
    from: dateUtils.getLastOfTwoDates(dr1.from, dr2.from),
    to: dateUtils.getFirstOfTwoDates(dr1.to, dr2.to),
});

export const extractArbeidIPeriodeSøknadsdata = ({
    arbeiderIPerioden,
    prosentAvNormalt,
    snittTimerPerUke,
    timerEllerProsent,
}: ArbeidIPeriodeFormValues): ArbeidIPeriodeSøknadsdata | undefined => {
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
        timerEllerProsent === TimerEllerProsent.TIMER ? getNumberFromNumberInputValue(snittTimerPerUke) : undefined;

    if (snittTimerPerUke && timerISnittPerUke) {
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
    return undefined;
};
