import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from '../Arbeidsgiver';
import { FrilansoppdragType } from '../FrilansoppdragFormData';
import { ArbeidsforholdSøknadsdata } from './arbeidsforholdSøknadsdata';

export type FrilansereSøknadsdata = Map<string, ArbeidNyFrilansSøknadsdata>;

export interface ArbeidNyttFrilansoppdragSøknadsdataUtenArbeidsforhold {
    type: 'utenArbeidsforhold';
    arbeidsgiver: Arbeidsgiver;
    frilansOppdragKategori: FrilansoppdragType;
    styremedlemHeleInntekt?: true;
}

export interface ArbeidNyttFrilansoppdragSøknadsdataSluttetISøknadsperiode {
    type: 'sluttetISøknadsperiode';
    arbeidsgiver: Arbeidsgiver;
    frilansOppdragKategori: FrilansoppdragType;
    styremedlemHeleInntekt?: false;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}

export interface ArbeidNyttFrilansoppdragSøknadsdataPågående {
    type: 'pågående';
    arbeidsgiver: Arbeidsgiver;
    frilansOppdragKategori: FrilansoppdragType;
    styremedlemHeleInntekt?: false;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}
export type ArbeidNyFrilansSøknadsdata =
    | ArbeidNyttFrilansoppdragSøknadsdataUtenArbeidsforhold
    | ArbeidNyttFrilansoppdragSøknadsdataSluttetISøknadsperiode
    | ArbeidNyttFrilansoppdragSøknadsdataPågående;
