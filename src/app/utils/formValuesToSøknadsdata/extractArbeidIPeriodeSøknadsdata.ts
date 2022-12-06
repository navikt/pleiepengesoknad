import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { dateUtils, ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeFrilansSøknadsdata } from '../../types/søknadsdata/arbeidIPeriodeFrilansSøknadsdata';
import { TimerEllerProsent } from '../../types';
import {
    ArbeidIPeriodeFormValues,
    ArbeidsukerFormValues,
    OmsorgsstønadIPerioden,
    VervSvar,
} from '../../types/ArbeidIPeriodeFormValues';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import { ArbeidIPeriodeSøknadsdata, ArbeidsukerTimerSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const getMinDateRangeFromDateRanges = (dr1: DateRange, dr2: DateRange): DateRange => ({
    from: dateUtils.getLastOfTwoDates(dr1.from, dr2.from),
    to: dateUtils.getFirstOfTwoDates(dr1.to, dr2.to),
});

export const extractArbeidsukerTimerSøknadsdata = (arbeidsuker: ArbeidsukerFormValues): ArbeidsukerTimerSøknadsdata => {
    const arbeidsukerSøknadsdata: ArbeidsukerTimerSøknadsdata = [];
    Object.keys(arbeidsuker).forEach((isoDateRange) => {
        const arbeidsuke = arbeidsuker[isoDateRange];
        const periode = ISODateRangeToDateRange(isoDateRange);
        const timerISnittPerUke = getNumberFromNumberInputValue(arbeidsuke.snittTimerPerUke);
        if (timerISnittPerUke !== undefined) {
            arbeidsukerSøknadsdata.push({ periode, timer: timerISnittPerUke });
        }
    });
    return arbeidsukerSøknadsdata;
};

export const extractArbeidIPeriodeSøknadsdata = ({
    arbeiderIPerioden,
    prosentAvNormalt,
    snittTimerPerUke,
    timerEllerProsent,
    erLiktHverUke,
    arbeidsuker,
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

    if (erLiktHverUke === YesOrNo.YES) {
        const arbeiderProsent =
            timerEllerProsent === TimerEllerProsent.PROSENT
                ? getNumberFromNumberInputValue(prosentAvNormalt)
                : undefined;

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
    }
    if ((erLiktHverUke === YesOrNo.NO || erLiktHverUke === undefined) && arbeidsuker) {
        return {
            type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer,
            arbeiderRedusert: true,
            arbeiderIPerioden: true,
            arbeidsuker: extractArbeidsukerTimerSøknadsdata(arbeidsuker),
        };
    }

    return undefined;
};

export const extractArbeidIPeriodeFrilanserSøknadsdata = ({
    arbeiderIPerioden,
    snittTimerPerUke,
    erLiktHverUke,
    arbeidsuker,
    omsorgsstønadSvar,
    vervSvar,
}: ArbeidIPeriodeFormValues): ArbeidIPeriodeFrilansSøknadsdata | undefined => {
    if (
        arbeiderIPerioden === ArbeiderIPeriodenSvar.redusert ||
        omsorgsstønadSvar === OmsorgsstønadIPerioden.mottarRedusert ||
        vervSvar === VervSvar.misterDelerAvHonorarer
    ) {
        if (erLiktHverUke === YesOrNo.YES) {
            const timerISnittPerUke = getNumberFromNumberInputValue(snittTimerPerUke);

            if (snittTimerPerUke && timerISnittPerUke) {
                return {
                    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
                    frilansIPeriode: arbeiderIPerioden,
                    omsorgsstønad: omsorgsstønadSvar,
                    verv: vervSvar,
                    timerISnittPerUke,
                };
            }
        }

        if ((erLiktHverUke === YesOrNo.NO || erLiktHverUke === undefined) && arbeidsuker) {
            return {
                type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer,
                frilansIPeriode: arbeiderIPerioden,
                omsorgsstønad: omsorgsstønadSvar,
                verv: vervSvar,
                arbeidsuker: extractArbeidsukerTimerSøknadsdata(arbeidsuker),
            };
        }
    }

    return {
        type: ArbeidIPeriodeType.arbeiderIkkeEllerVanlig,
        frilansIPeriode: arbeiderIPerioden,
        omsorgsstønad: omsorgsstønadSvar,
        verv: vervSvar,
    };

    return undefined;
};
