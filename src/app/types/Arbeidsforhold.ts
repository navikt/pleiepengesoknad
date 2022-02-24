import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidIPeriode } from './SøknadFormData';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum ArbeidsforholdField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    jobberNormaltTimer = 'jobberNormaltTimer',
    arbeidIPeriode = 'arbeidIPeriode',
    harFraværIPeriode = 'harFraværIPeriode',
}

export interface Arbeidsforhold {
    arbeidsgiver: Arbeidsgiver;
    [ArbeidsforholdField.jobberNormaltTimer]?: string;
    [ArbeidsforholdField.harFraværIPeriode]?: YesOrNo;
    [ArbeidsforholdField.erAnsatt]?: YesOrNo;
    [ArbeidsforholdField.sluttetFørSøknadsperiode]?: YesOrNo;
    [ArbeidsforholdField.arbeidIPeriode]?: ArbeidIPeriode;
}

export type ArbeidsforholdFrilanser = Omit<Arbeidsforhold, 'arbeidsgiver'>;
