import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from '../Arbeidsgiver';
import { FrilanserOppdragType } from '../FrilansFormData';
import { FrilanserOppdragIPeriodenApi } from '../søknad-api-data/frilansOppdragApiData';
import { ArbeidsforholdSøknadsdata } from './arbeidsforholdSøknadsdata';

export type OppdragsgivereSøknadsdata = Map<string, ArbeidFrilansOppdragSøknadsdata>;

export interface FrilansOppdragSluttetFørSøknadsperiode {
    type: 'sluttetFørSøknadsperiode';
    arbeidsgiver: Arbeidsgiver;
}

export interface FrilansUtenArbeidsforhold {
    type: 'utenArbeidsforhold';
    harOppdragIPerioden: FrilanserOppdragIPeriodenApi;
    frilansOppdragKategori: FrilanserOppdragType.FOSTERFORELDER | FrilanserOppdragType.STYREMEDLEM_ELLER_VERV;
    styremedlemHeleInntekt?: true;
    arbeidsgiver: Arbeidsgiver;
}

export interface FrilansOppdragSøknadsdataSluttetISøknadsperiode {
    type: 'sluttetISøknadsperiode';
    harOppdragIPerioden: FrilanserOppdragIPeriodenApi;
    frilansOppdragKategori: FrilanserOppdragType;
    arbeidsgiver: Arbeidsgiver;
    styremedlemHeleInntekt?: false;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}

export interface ArbeidFrilansOppdragSøknadsdataPågående {
    type: 'pågående';
    harOppdragIPerioden: FrilanserOppdragIPeriodenApi;
    frilansOppdragKategori: FrilanserOppdragType;
    arbeidsgiver: Arbeidsgiver;
    styremedlemHeleInntekt?: false;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}
export type ArbeidFrilansOppdragSøknadsdata =
    | FrilansOppdragSluttetFørSøknadsperiode
    | FrilansOppdragSøknadsdataSluttetISøknadsperiode
    | ArbeidFrilansOppdragSøknadsdataPågående
    | FrilansUtenArbeidsforhold;
