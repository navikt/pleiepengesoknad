import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeFormData } from './ArbeidIPeriodeFormData';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum ArbeidsforholdFormField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    normalarbeidstid = 'normalarbeidstid',
    normalarbeidstid_erLikeMangeTimerHverUke = 'normalarbeidstid.erLikeMangeTimerHverUke',
    normalarbeidstid_erFasteUkedager = 'normalarbeidstid.erFasteUkedager',
    normalarbeidstid_TimerPerUke = 'normalarbeidstid.timerPerUke',
    normalarbeidstid_timerFasteUkedager = 'normalarbeidstid.timerFasteUkedager',
    arbeidIPeriode = 'arbeidIPeriode',
}

export type NormalarbeidstidFormData = {
    erLikeMangeTimerHverUke?: YesOrNo;
    erFasteUkedager?: YesOrNo;
    timerPerUke?: string;
    timerFasteUkedager?: DurationWeekdays;
};

export interface ArbeidsforholdFormData {
    arbeidsgiver: Arbeidsgiver;
    erAnsatt?: YesOrNo;
    sluttetFørSøknadsperiode?: YesOrNo;
    normalarbeidstid?: NormalarbeidstidFormData;
    arbeidIPeriode?: ArbeidIPeriodeFormData;
}

export type ArbeidsforholdFrilanserFormData = Omit<ArbeidsforholdFormData, 'arbeidsgiver' | 'erAnsatt'>;
export type ArbeidsforholdSelvstendigFormData = Omit<
    ArbeidsforholdFormData,
    'arbeidsgiver' | 'erAnsatt' | 'sluttetFørSøknadsperiode'
>;
