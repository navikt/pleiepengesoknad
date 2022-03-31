import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeFormData } from './ArbeidIPeriodeFormData';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum ArbeidsforholdFormField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    normalarbeidstid = 'normalarbeidstid',
    erLiktHverUke = 'normalarbeidstid.erLiktHverUke',
    jobberNormaltTimerLiktHverDag = 'normalarbeidstid.liktHverDag',
    jobberNormaltTimerPerUke = 'normalarbeidstid.timerPerUke',
    jobberNormaltTimerFasteDager = 'normalarbeidstid.fasteDager',
    harFraværIPeriode = 'harFraværIPeriode',
    arbeidIPeriode = 'arbeidIPeriode',
}

export type NormalarbeidstidFormData = {
    erLiktHverUke?: YesOrNo;
    liktHverDag?: YesOrNo;
    timerPerUke?: string;
    fasteDager?: DurationWeekdays;
};

export interface ArbeidsforholdFormData {
    arbeidsgiver: Arbeidsgiver;
    normalarbeidstid?: NormalarbeidstidFormData;
    harFraværIPeriode?: YesOrNo;
    erAnsatt?: YesOrNo;
    sluttetFørSøknadsperiode?: YesOrNo;
    arbeidIPeriode?: ArbeidIPeriodeFormData;
}

export type ArbeidsforholdFrilanserFormData = Omit<ArbeidsforholdFormData, 'arbeidsgiver' | 'erAnsatt'>;
export type ArbeidsforholdSelvstendigFormData = Omit<
    ArbeidsforholdFormData,
    'arbeidsgiver' | 'erAnsatt' | 'sluttetFørSøknadsperiode'
>;
