import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from '../Arbeidsgiver';
import { FrilanserOppdragType } from '../FrilansFormData';
import { ArbeidsforholdSøknadsdata } from './arbeidsforholdSøknadsdata';

export type FrilansereSøknadsdata = Map<string, ArbeidNyFrilansSøknadsdata>;

export interface ArbeidNyFrilansSøknadsdataUtenArbeidsforhold {
    type: 'utenArbeidsforhold';
    arbeidsgiver: Arbeidsgiver;
    frilansOppdragKategori: FrilanserOppdragType;
    styremedlemHeleInntekt?: true;
}

export interface ArbeidNyFrilansSøknadsdataSluttetISøknadsperiode {
    type: 'sluttetISøknadsperiode';
    arbeidsgiver: Arbeidsgiver;
    frilansOppdragKategori: FrilanserOppdragType;
    styremedlemHeleInntekt?: false;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}

export interface ArbeidNyFrilansSøknadsdataPågående {
    type: 'pågående';
    arbeidsgiver: Arbeidsgiver;
    frilansOppdragKategori: FrilanserOppdragType;
    styremedlemHeleInntekt?: false;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}
export type ArbeidNyFrilansSøknadsdata =
    | ArbeidNyFrilansSøknadsdataUtenArbeidsforhold
    | ArbeidNyFrilansSøknadsdataSluttetISøknadsperiode
    | ArbeidNyFrilansSøknadsdataPågående;
