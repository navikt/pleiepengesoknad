import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriode } from './ArbeidIPeriode';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum ArbeidsforholdFormField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    normalarbeidstid = 'normalarbeidstid',
    erLiktHverUke = 'normalarbeidstid.erLiktHverUke',
    jobberNormaltTimerPerUke = 'normalarbeidstid.timerPerUke',
    jobberNormaltTimerFasteDager = 'normalarbeidstid.fasteDager',
    harFraværIPeriode = 'harFraværIPeriode',
    arbeidIPeriode = 'arbeidIPeriode',
}

export type Normalarbeidstid = {
    erLiktHverUke?: YesOrNo;
    timerPerUke?: string;
    fasteDager?: DurationWeekdays;
};

export interface Arbeidsforhold {
    arbeidsgiver: Arbeidsgiver;
    normalarbeidstid?: Normalarbeidstid;
    harFraværIPeriode?: YesOrNo;
    erAnsatt?: YesOrNo;
    sluttetFørSøknadsperiode?: YesOrNo;
    arbeidIPeriode?: ArbeidIPeriode;
}

export type ArbeidsforholdFrilanser = Omit<Arbeidsforhold, 'arbeidsgiver' | 'erAnsatt'>;
export type ArbeidsforholdSelvstendig = Omit<Arbeidsforhold, 'arbeidsgiver' | 'erAnsatt'>;
