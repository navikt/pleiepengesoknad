import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidIPeriode } from './ArbeidIPeriode';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum ArbeidsforholdFormField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    jobberNormaltTimer = 'jobberNormaltTimer',
    harFraværIPeriode = 'harFraværIPeriode',
    arbeidIPeriode = 'arbeidIPeriode',
}

export interface Arbeidsforhold {
    arbeidsgiver: Arbeidsgiver;
    [ArbeidsforholdFormField.jobberNormaltTimer]?: string;
    [ArbeidsforholdFormField.harFraværIPeriode]?: YesOrNo;
    [ArbeidsforholdFormField.erAnsatt]?: YesOrNo;
    [ArbeidsforholdFormField.sluttetFørSøknadsperiode]?: YesOrNo;
    [ArbeidsforholdFormField.arbeidIPeriode]?: ArbeidIPeriode;
}

export type ArbeidsforholdFrilanser = Omit<Arbeidsforhold, 'arbeidsgiver' | 'erAnsatt'>;
export type ArbeidsforholdSelvstendig = Omit<Arbeidsforhold, 'arbeidsgiver' | 'erAnsatt'>;
