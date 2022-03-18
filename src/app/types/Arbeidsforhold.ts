import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriode } from './ArbeidIPeriode';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum ArbeidsforholdFormField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    erLiktHverUke = 'erLiktHverUke',
    jobberNormaltTimer = 'jobberNormaltTimer',
    jobberNormaltTimerUkedager = 'jobberNormaltTimerUkedager',
    harFraværIPeriode = 'harFraværIPeriode',
    arbeidIPeriode = 'arbeidIPeriode',
}

export interface Arbeidsforhold {
    arbeidsgiver: Arbeidsgiver;
    [ArbeidsforholdFormField.jobberNormaltTimer]?: string;
    [ArbeidsforholdFormField.jobberNormaltTimerUkedager]?: DurationWeekdays;
    [ArbeidsforholdFormField.harFraværIPeriode]?: YesOrNo;
    [ArbeidsforholdFormField.erLiktHverUke]?: YesOrNo;
    [ArbeidsforholdFormField.erAnsatt]?: YesOrNo;
    [ArbeidsforholdFormField.sluttetFørSøknadsperiode]?: YesOrNo;
    [ArbeidsforholdFormField.arbeidIPeriode]?: ArbeidIPeriode;
}

export type ArbeidsforholdFrilanser = Omit<Arbeidsforhold, 'arbeidsgiver' | 'erAnsatt'>;
export type ArbeidsforholdSelvstendig = Omit<Arbeidsforhold, 'arbeidsgiver' | 'erAnsatt'>;
