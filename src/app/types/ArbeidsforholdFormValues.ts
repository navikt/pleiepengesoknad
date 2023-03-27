import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidIPeriodeFormValues } from './ArbeidIPeriodeFormValues';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum ArbeidsforholdFormField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    normalarbeidstid = 'normalarbeidstid',
    normalarbeidstid_erLiktSomForrigeSøknad = 'normalarbeidstid.erLiktSomForrigeSøknad',
    normalarbeidstid_TimerPerUke = 'normalarbeidstid.timerPerUke',
    arbeidIPeriode = 'arbeidIPeriode',
}

export type NormalarbeidstidFormValues = {
    erLiktSomForrigeSøknad?: YesOrNo;
    timerPerUke?: string;
};

export interface ArbeidsforholdFormValues {
    arbeidsgiver: Arbeidsgiver;
    erAnsatt?: YesOrNo;
    sluttetFørSøknadsperiode?: YesOrNo;
    normalarbeidstid?: NormalarbeidstidFormValues;
    arbeidIPeriode?: ArbeidIPeriodeFormValues;
}

export type ArbeidsforholdFrilanserFormValues = Omit<
    ArbeidsforholdFormValues,
    'arbeidsgiver' | 'erAnsatt' | 'sluttetFørSøknadsperiode'
>;
export type ArbeidsforholdSelvstendigFormValues = Omit<
    ArbeidsforholdFormValues,
    'arbeidsgiver' | 'erAnsatt' | 'sluttetFørSøknadsperiode'
>;
