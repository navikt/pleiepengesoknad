import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeSøknadsdata, ArbeidIPeriodeType } from '../../types/søknadsdata/arbeidIPeriodeSøknadsdata';

export const getArbeidSøknadsperiodeFormValues = (
    arbeid?: ArbeidIPeriodeSøknadsdata
): ArbeidIPeriodeFormData | undefined => {
    if (!arbeid) {
        return undefined;
    }
    switch (arbeid.type) {
        case ArbeidIPeriodeType.arbeiderIkke:
            return {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær,
            };
        case ArbeidIPeriodeType.arbeiderVanlig:
            return {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
            };
        case ArbeidIPeriodeType.arbeiderKunSmåoppdrag:
            return {}; // Bruker svarer ikke på dette når det er frilans og kun småoppdrag
        case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
            return {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                timerEllerProsent: TimerEllerProsent.PROSENT,
                prosentAvNormalt: `${arbeid.prosentAvNormalt}`,
            };
        case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
            return {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                timerEllerProsent: TimerEllerProsent.TIMER,
                timerPerUke: `${arbeid.timerISnittPerUke}`,
            };
        case ArbeidIPeriodeType.arbeiderFasteUkedager:
            return {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                timerEllerProsent: TimerEllerProsent.PROSENT,
                erLiktHverUke: YesOrNo.YES,
                fasteDager: arbeid.fasteDager,
            };
        case ArbeidIPeriodeType.arbeiderEnkeltdager:
            return {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                timerEllerProsent: TimerEllerProsent.PROSENT,
                erLiktHverUke: YesOrNo.NO,
                enkeltdager: arbeid.enkeltdager,
            };
    }
};
