import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from '../Arbeidsgiver';
import { FrilansoppdragType } from '../FrilansoppdragFormData';
import { FrilansoppdragIPeriodenApi } from '../søknad-api-data/frilansoppdragApiData';
import { ArbeidsforholdSøknadsdata } from './arbeidsforholdSøknadsdata';

export type FrilansoppdragsgivereSøknadsdata = Map<string, ArbeidFrilansOppdragSøknadsdata>;
// TODO: Slå sammen oppdrag og nytt lage felles type
// Basetype
// Vurdere enum på søknadsdato type
export interface FrilansoppdragSøknadsdataSluttetFørSøknadsperiode {
    type: 'sluttetFørSøknadsperiode';
    arbeidsgiver: Arbeidsgiver;
}

export interface FrilansoppdragSøknadsdataUtenArbeidsforhold {
    type: 'utenArbeidsforhold';
    harOppdragIPerioden: FrilansoppdragIPeriodenApi;
    frilansoppdragKategori: FrilansoppdragType.FOSTERFORELDER | FrilansoppdragType.STYREMEDLEM_ELLER_VERV;
    styremedlemHeleInntekt?: true;
    arbeidsgiver: Arbeidsgiver;
}

export interface FrilansoppdragSøknadsdataSluttetISøknadsperiode {
    type: 'sluttetISøknadsperiode';
    harOppdragIPerioden: FrilansoppdragIPeriodenApi;
    frilansoppdragKategori: FrilansoppdragType;
    arbeidsgiver: Arbeidsgiver;
    styremedlemHeleInntekt?: false;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}

export interface FrilansoppdragSøknadsdataPågående {
    type: 'pågående';
    harOppdragIPerioden: FrilansoppdragIPeriodenApi;
    frilansoppdragKategori: FrilansoppdragType;
    arbeidsgiver: Arbeidsgiver;
    styremedlemHeleInntekt?: false;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}
export type ArbeidFrilansOppdragSøknadsdata =
    | FrilansoppdragSøknadsdataSluttetFørSøknadsperiode
    | FrilansoppdragSøknadsdataSluttetISøknadsperiode
    | FrilansoppdragSøknadsdataPågående
    | FrilansoppdragSøknadsdataUtenArbeidsforhold;
