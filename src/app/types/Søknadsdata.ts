import { DateRange } from '@navikt/sif-common-formik/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver } from './Arbeidsgiver';

export interface NormalarbeidstidSøknadsdata {
    erLiktHverUke: boolean;
    fasteDager: DurationWeekdays;
    timerPerUke: number;
}

export interface ArbeidsforholdSøknadsdataMedFravær {
    harFraværIPeriode: true;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    arbeidISøknadsperiode?: ArbeidISøknadsperiodeSøknadsdata;
}

export interface ArbeidsforholdSøknadsdataUtenFravær {
    harFraværIPeriode: false;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
}

export type ArbeidsforholdSøknadsdata = ArbeidsforholdSøknadsdataMedFravær | ArbeidsforholdSøknadsdataUtenFravær;

export interface ArbeidAnsattSøknadsdata {
    erAnsattISøknadsperiode: boolean;
    arbeidsgiver: Arbeidsgiver;
    arbeidsforhold?: ArbeidsforholdSøknadsdata;
}

export interface ArbeidFrilansSøknadsdataErIkkeFrilanser {
    type: 'erIkkeFrilanser';
    erFrilanser: false;
}
export interface ArbeidFrilansSøknadsdataPågående {
    erFrilanser: true;
    type: 'pågående';
    harInntektISøknadsperiode: true;
    erFortsattFrilanser: true;
    startdato: Date;
    aktivPeriode: DateRange;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}

export interface ArbeidFrilansSøknadsdataUtenforSøknadsperiode {
    erFrilanser: true;
    type: 'avsluttetFørSøknadsperiode';
    harInntektISøknadsperiode: false;
    startdato: Date;
    sluttdato: Date;
}
export interface ArbeidFrilansSøknadsdataAvsluttet {
    erFrilanser: true;
    type: 'avsluttetISøknadsperiode';
    harInntektISøknadsperiode: true;
    erFortsattFrilanser: false;
    startdato: Date;
    sluttdato: Date;
    aktivPeriode: DateRange;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}

export type ArbeidFrilansSøknadsdata =
    | ArbeidFrilansSøknadsdataErIkkeFrilanser
    | ArbeidFrilansSøknadsdataPågående
    | ArbeidFrilansSøknadsdataUtenforSøknadsperiode
    | ArbeidFrilansSøknadsdataAvsluttet;

export interface ArbeidSelvstendigSøknadsdata {
    startdato: Date;
    virksomhet: Virksomhet;
    arbeidsforhold?: ArbeidsforholdSøknadsdata;
}

export type ArbeidsgivereSøknadsdata = Map<string, ArbeidAnsattSøknadsdata>;

export interface ArbeidSøknadsdata {
    arbeidsgivere?: ArbeidsgivereSøknadsdata;
    frilans?: ArbeidFrilansSøknadsdata;
    selvstendig?: ArbeidSelvstendigSøknadsdata;
}

interface IngenArbeidISøknadsperiodeSøknadsdata {
    type: 'arbeiderIkkeIPerioden';
    skalArbeide: false;
}
interface ArbeidISøknadsperiodeVariertSøknadsdata {
    type: 'variert';
    arbeiderIPerioden: true;
    erLiktHverUke: false;
    enkeltdager: DateDurationMap;
}
interface ArbeidISøknadsperiodeFasteDagerSøknadsdata {
    type: 'fasteDager';
    arbeiderIPerioden: true;
    erLiktHverUke: true;
    fasteDager: DurationWeekdays;
}
interface ArbeidProsentISøknadsperiodeFastProsentSøknadsdata {
    type: 'fastProsent';
    arbeiderIPerioden: true;
    erLiktHverUke: true;
    fasteDager: DurationWeekdays;
    jobberProsent: number;
}

export type ArbeidISøknadsperiodeSøknadsdata =
    | IngenArbeidISøknadsperiodeSøknadsdata
    | ArbeidISøknadsperiodeVariertSøknadsdata
    | ArbeidISøknadsperiodeFasteDagerSøknadsdata
    | ArbeidProsentISøknadsperiodeFastProsentSøknadsdata;

export interface Søknadsdata {
    søknadsperiode?: DateRange;
    arbeid?: ArbeidSøknadsdata;
}
