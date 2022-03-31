import { DateRange } from '@navikt/sif-common-formik/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver } from './Arbeidsgiver';

export interface NormalarbeidstidSøknadsdataLikeDager {
    type: 'likeDagerHverUke';
    erLiktHverUke: true;
    erLiktHverDag: true;
    timerPerDag: number;
    /** Satt ut fra timerPerDag */
    fasteDager: DurationWeekdays;
    /** Satt ut fra timer per dag */
    timerPerUke: number;
}
export interface NormalarbeidstidSøknadsdataUlikeDager {
    type: 'ulikeDagerHverUke';
    erLiktHverUke: true;
    erLiktHverDag: false;
    fasteDager: DurationWeekdays;
    /** Beregnet ut fra faste dager */
    timerPerUke: number;
}
export interface NormalarbeidstidSøknadsdataUlikeUker {
    type: 'ulikeUker';
    erLiktHverUke: false;
    timerPerUke: number;
    /** Fordelt ut fra timerPerUke */
    fasteDager: DurationWeekdays;
}

export type NormalarbeidstidSøknadsdata =
    | NormalarbeidstidSøknadsdataLikeDager
    | NormalarbeidstidSøknadsdataUlikeDager
    | NormalarbeidstidSøknadsdataUlikeUker;

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
export interface ArbeidFrilansSøknadsdataAvsluttetISøknadsperiode {
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
    | ArbeidFrilansSøknadsdataAvsluttetISøknadsperiode;

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
    jobberTimerPerUke: number;
    jobberProsent: number;
}

interface ArbeidProsentISøknadsperiodeFastTimerPerUkeSøknadsdata {
    type: 'fastTimer';
    arbeiderIPerioden: true;
    erLiktHverUke: true;
    fasteDager: DurationWeekdays;
    jobberTimerPerUke: number;
}

export type ArbeidIPeriodeSøknadsdata =
    | IngenArbeidISøknadsperiodeSøknadsdata
    | ArbeidISøknadsperiodeVariertSøknadsdata
    | ArbeidISøknadsperiodeFasteDagerSøknadsdata
    | ArbeidProsentISøknadsperiodeFastTimerPerUkeSøknadsdata
    | ArbeidProsentISøknadsperiodeFastProsentSøknadsdata;

export interface Søknadsdata {
    søknadsperiode?: DateRange;
    arbeid?: ArbeidSøknadsdata;
}
