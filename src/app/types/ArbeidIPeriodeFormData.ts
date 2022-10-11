import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { TimerEllerProsent } from './TimerEllerProsent';

export enum ArbeidIPeriodeFormField {
    arbeiderIPerioden = 'arbeiderIPerioden',
    erLiktHverUke = 'erLiktHverUke',
    timerEllerProsent = 'timerEllerProsent',
    prosentAvNormalt = 'prosentAvNormalt',
    timerPerUke = 'timerPerUke',
}

export interface ArbeidIPeriodeFormData {
    [ArbeidIPeriodeFormField.arbeiderIPerioden]?: ArbeiderIPeriodenSvar;
    [ArbeidIPeriodeFormField.timerEllerProsent]?: TimerEllerProsent;
    [ArbeidIPeriodeFormField.prosentAvNormalt]?: string;
    [ArbeidIPeriodeFormField.timerPerUke]?: string;
}
