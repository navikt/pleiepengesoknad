import { DateRange } from '@navikt/sif-common-formik/lib';
import { FrilansOppdragKategori, YesOrNoRadio } from '../FrilansFormData';
import { ArbeidsforholdSøknadsdata } from './arbeidsforholdSøknadsdata';

export type FrilansereSøknadsdata = Map<string, ArbeidNyFrilansSøknadsdata>;

export interface ArbeidNyFrilansSøknadsdataErIkkeFrilanser {
    type: 'erIkkeFrilanser';
    erFrilanser: false;
}

export interface ArbeidNyFrilansSøknadsdataUtenArbeidsforhold {
    type: 'utenArbeidsforhold';
    id: string;
    navn: string;
    startdato: Date;
    sluttdato?: Date;
    frilansOppdragKategori: FrilansOppdragKategori;
    styremedlemHeleInntekt?: YesOrNoRadio.JA;
}

export interface ArbeidNyFrilansSøknadsdataSluttetISøknadsperiode {
    type: 'sluttetISøknadsperiode';
    id: string;
    navn: string;
    startdato: Date;
    sluttdato: Date;
    frilansOppdragKategori: FrilansOppdragKategori;
    styremedlemHeleInntekt?: YesOrNoRadio.NEI;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}

export interface ArbeidNyFrilansSøknadsdataPågående {
    type: 'pågående';
    id: string;
    startdato: Date;
    navn: string;
    frilansOppdragKategori: FrilansOppdragKategori;
    styremedlemHeleInntekt?: YesOrNoRadio;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    aktivPeriode: DateRange;
}
export type ArbeidNyFrilansSøknadsdata =
    | ArbeidNyFrilansSøknadsdataErIkkeFrilanser
    | ArbeidNyFrilansSøknadsdataUtenArbeidsforhold
    | ArbeidNyFrilansSøknadsdataSluttetISøknadsperiode
    | ArbeidNyFrilansSøknadsdataPågående;
