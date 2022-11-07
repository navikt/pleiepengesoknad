import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from '../Arbeidsgiver';
import { FrilansOppdragKategori, YesOrNoRadio } from '../FrilansFormData';
import { ArbeidsforholdSøknadsdata } from './arbeidsforholdSøknadsdata';

export type OppdragsgivereSøknadsdata = Map<string, ArbeidFrilansOppdragSøknadsdata>;

export interface ArbeidFrilansOppdragSøknadsdataSluttetFørSøknadsperiode {
    type: 'sluttetFørSøknadsperiode';
    arbeidsgiver: Arbeidsgiver;
}
export interface ArbeidFrilansUtenArbeidsForhold {
    type: 'utenArbeidsForhold';
    sluttdato?: Date;
    frilansOppdragKategori: FrilansOppdragKategori;
    arbeidsgiver: Arbeidsgiver;
    styremedlemHeleInntekt?: YesOrNoRadio.JA;
}

export interface ArbeidFrilansOppdragSøknadsdataSluttetISøknadsperiode {
    type: 'sluttetISøknadsperiode';
    sluttdato: Date;
    frilansOppdragKategori: FrilansOppdragKategori;
    arbeidsgiver: Arbeidsgiver;
    styremedlemHeleInntekt?: YesOrNoRadio.NEI;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}

export interface ArbeidFrilansOppdragSøknadsdataPågående {
    type: 'pågående';
    frilansOppdragKategori: FrilansOppdragKategori;
    arbeidsgiver: Arbeidsgiver;
    styremedlemHeleInntekt?: YesOrNoRadio;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}
export type ArbeidFrilansOppdragSøknadsdata =
    | ArbeidFrilansOppdragSøknadsdataSluttetFørSøknadsperiode
    | ArbeidFrilansOppdragSøknadsdataSluttetISøknadsperiode
    | ArbeidFrilansOppdragSøknadsdataPågående
    | ArbeidFrilansUtenArbeidsForhold;
