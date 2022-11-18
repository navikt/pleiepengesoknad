import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeFormValues } from './ArbeidIPeriodeFormValues';
import { Arbeidsgiver } from './Arbeidsgiver';
import { FrilansoppdragType } from './FrilansoppdragFormData';
import { FrilansoppdragIPeriodenApi } from './søknad-api-data/frilansoppdragApiData';

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

export type ArbeidsforholdFrilansoppdragFormValues = Omit<
    ArbeidsforholdFormValues,
    'erAnsatt' | 'sluttetFørSøknadsperiode'
> & {
    frilansoppdragIPerioden?: FrilansoppdragIPeriodenApi;
    frilansoppdragKategori?: FrilansoppdragType;
    styremedlemHeleInntekt?: YesOrNo;
    sluttdato?: ISODate;
    sluttet?: boolean;
};

export type ArbeidsforholdSelvstendigFormValues = Omit<
    ArbeidsforholdFormValues,
    'arbeidsgiver' | 'erAnsatt' | 'sluttetFørSøknadsperiode'
>;
