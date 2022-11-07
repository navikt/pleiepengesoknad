import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeFormValues } from './ArbeidIPeriodeFormValues';
import { Arbeidsgiver } from './Arbeidsgiver';
import { FrilansOppdragKategori, FrilansOppdragSvar, YesOrNoRadio } from './FrilansFormData';

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

export type ArbeidsforholdFrilanserFormValues = Omit<ArbeidsforholdFormValues, 'arbeidsgiver' | 'erAnsatt'>;
export type ArbeidsforholdFrilanserMedOppdragFormValues = Omit<
    ArbeidsforholdFormValues,
    'erAnsatt' | 'sluttetFørSøknadsperiode'
> & {
    frilansOppdragIPerioden?: FrilansOppdragSvar;
    frilansOppdragKategori?: FrilansOppdragKategori;
    sluttdato?: ISODate;
    styremedlemHeleInntekt?: YesOrNoRadio;
};
export type ArbeidsforholdFrilanserNyFormValues = Omit<
    ArbeidsforholdFormValues,
    'erAnsatt' | 'sluttetFørSøknadsperiode' | 'arbeidsgiver'
> & {
    id: string;
    navn: string;
    frilansOppdragKategori?: FrilansOppdragKategori;
    startdato?: ISODate;
    sluttet?: boolean;
    sluttdato?: ISODate;
    styremedlemHeleInntekt?: YesOrNoRadio;
};
export type ArbeidsforholdSelvstendigFormValues = Omit<
    ArbeidsforholdFormValues,
    'arbeidsgiver' | 'erAnsatt' | 'sluttetFørSøknadsperiode' | 'frilansOppdragIPerioden'
>;
