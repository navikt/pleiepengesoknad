import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeFormValues } from './ArbeidIPeriodeFormValues';
import { Arbeidsgiver } from './Arbeidsgiver';
import { FrilanserOppdragType } from './FrilansFormData';
import { FrilanserOppdragIPeriodenApi } from './søknad-api-data/frilansOppdragApiData';

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
    frilansOppdragIPerioden?: FrilanserOppdragIPeriodenApi;
    frilansOppdragKategori?: FrilanserOppdragType;
    styremedlemHeleInntekt?: YesOrNo;
    sluttdato?: ISODate;
    sluttet?: boolean;
};

export type ArbeidsforholdSelvstendigFormValues = Omit<
    ArbeidsforholdFormValues,
    'arbeidsgiver' | 'erAnsatt' | 'sluttetFørSøknadsperiode' | 'frilansOppdragIPerioden'
>;
