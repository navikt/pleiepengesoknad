import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidIPeriodeFormData } from './ArbeidIPeriodeFormData';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum ArbeidsforholdFormField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    normalarbeidstid = 'normalarbeidstid',
    normalarbeidstid_erLiktSomForrigeSøknad = 'normalarbeidstid.erLiktSomForrigeSøknad',
    normalarbeidstid_TimerPerUke = 'normalarbeidstid.timerPerUke',
    arbeidIPeriode = 'arbeidIPeriode',
}

export type NormalarbeidstidFormData = {
    erLiktSomForrigeSøknad?: YesOrNo;
    timerPerUke?: string;
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
