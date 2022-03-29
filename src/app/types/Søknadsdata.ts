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
    arbeidISøknadsperiode?: ArbeidIPeriodeSøknadsdata;
}

export interface ArbeidsforholdSøknadsdataUtenFravær {
    harFraværIPeriode: false;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
}

export type ArbeidsforholdSøknadsdata = ArbeidsforholdSøknadsdataMedFravær | ArbeidsforholdSøknadsdataUtenFravær;

export interface ArbeidAnsattSøknadsdataSluttetFørSøknadsperiode {
    type: 'sluttetFørSøknadsperiode';
    erAnsattISøknadsperiode: false;
    arbeidsgiver: Arbeidsgiver;
}
export interface ArbeidAnsattSøknadsdataSluttetISøknadsperiode {
    type: 'sluttetISøknadsperiode';
    erAnsattISøknadsperiode: true;
    arbeidsgiver: Arbeidsgiver;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}
export interface ArbeidAnsattSøknadsdataPågående {
    type: 'pågående';
    erAnsattISøknadsperiode: true;
    arbeidsgiver: Arbeidsgiver;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}
export type ArbeidAnsattSøknadsdata =
    | ArbeidAnsattSøknadsdataSluttetFørSøknadsperiode
    | ArbeidAnsattSøknadsdataSluttetISøknadsperiode
    | ArbeidAnsattSøknadsdataPågående;

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

export interface ArbeidSelvstendigSøknadsdataErIkkeSN {
    type: 'erIkkeSN';
}
export interface ArbeidSelvstendigSøknadsdataErSN {
    type: 'erSN';
    startdato: Date;
    virksomhet: Virksomhet;
    harFlereVirksomheter: boolean;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}

export type ArbeidSelvstendigSøknadsdata = ArbeidSelvstendigSøknadsdataErIkkeSN | ArbeidSelvstendigSøknadsdataErSN;

export type ArbeidsgivereSøknadsdata = Map<string, ArbeidAnsattSøknadsdata>;

export interface ArbeidSøknadsdata {
    arbeidsgivere?: ArbeidsgivereSøknadsdata;
    frilans?: ArbeidFrilansSøknadsdata;
    selvstendig?: ArbeidSelvstendigSøknadsdata;
}

interface IngenArbeidISøknadsperiodeSøknadsdata {
    type: 'arbeiderIkkeIPerioden';
    arbeiderIPerioden: false;
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

export type ArbeidIPeriodeSøknadsdata =
    | IngenArbeidISøknadsperiodeSøknadsdata
    | ArbeidISøknadsperiodeVariertSøknadsdata
    | ArbeidISøknadsperiodeFasteDagerSøknadsdata
    | ArbeidProsentISøknadsperiodeFastProsentSøknadsdata;

export interface Søknadsdata {
    søknadsperiode?: DateRange;
    arbeid?: ArbeidSøknadsdata;
}
