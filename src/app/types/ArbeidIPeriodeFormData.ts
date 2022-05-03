import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from './TimerEllerProsent';

export enum ArbeidIPeriodeFormField {
    arbeiderIPerioden = 'arbeiderIPerioden',
    erLiktHverUke = 'erLiktHverUke',
    timerEllerProsent = 'timerEllerProsent',
    prosentAvNormalt = 'prosentAvNormalt',
    timerPerUke = 'timerPerUke',
    fasteDager = 'fasteDager',
    enkeltdager = 'enkeltdager',
}

export interface ArbeidIPeriodeFormData {
    [ArbeidIPeriodeFormField.arbeiderIPerioden]?: ArbeiderIPeriodenSvar;
    [ArbeidIPeriodeFormField.erLiktHverUke]?: YesOrNo;
    [ArbeidIPeriodeFormField.timerEllerProsent]?: TimerEllerProsent;
    [ArbeidIPeriodeFormField.prosentAvNormalt]?: string;
    [ArbeidIPeriodeFormField.timerPerUke]?: string;
    [ArbeidIPeriodeFormField.enkeltdager]?: DateDurationMap;
    [ArbeidIPeriodeFormField.fasteDager]?: DurationWeekdays;
}
