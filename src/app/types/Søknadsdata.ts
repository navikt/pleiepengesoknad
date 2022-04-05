import { DateRange } from '@navikt/sif-common-formik/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver } from './Arbeidsgiver';

export enum NormalarbeidstidType {
    likeUkerOgDager = 'likeUkerOgDager',
    likeUkerVarierendeDager = 'likeUkerVarierendeDager',
    varierendeUker = 'varierendeUker',
}

export interface NormalarbeidstidSøknadsdataLikeUker {
    type: NormalarbeidstidType.likeUkerOgDager;
    erLiktHverUke: true;
    erFasteUkedager: true;
    timerFasteUkedager: DurationWeekdays;
}
export interface NormalarbeidstidSøknadsdataLikeUkerVarierendeUkedager {
    type: NormalarbeidstidType.likeUkerVarierendeDager;
    erLiktHverUke: true;
    erFasteUkedager: false;
    timerPerUkeISnitt: number;
}
export interface NormalarbeidstidSøknadsdataUlikeUker {
    type: NormalarbeidstidType.varierendeUker;
    erLiktHverUke: false;
    erFasteUkedager: false;
    timerPerUkeISnitt: number;
}

export type NormalarbeidstidSøknadsdata =
    | NormalarbeidstidSøknadsdataLikeUker
    | NormalarbeidstidSøknadsdataLikeUkerVarierendeUkedager
    | NormalarbeidstidSøknadsdataUlikeUker;

export interface ArbeidsforholdSøknadsdata {
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    arbeidISøknadsperiode?: ArbeidIPeriodeSøknadsdata;
}

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

export enum ArbeidIPeriodeType {
    'arbeiderIkke' = 'arbeiderIkke',
    'arbeiderVanlig' = 'arbeiderVanlig',
    'arbeiderEnkeltdager' = 'arbeiderEnkeltdager',
    'arbeiderFasteUkedager' = 'arbeiderFasteUkedager',
    'arbeiderProsentAvNormalt' = 'arbeiderProsentAvNormalt',
    'arbeiderSnittTimerPerUke' = 'arbeiderSnittTimerPerUke',
}

interface ArbeidISøknadsperiodeJobberIkkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderIkke;
    arbeiderIPerioden: false;
}
interface ArbeidISøknadsperiodeJobberVanligSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderVanlig;
    arbeiderIPerioden: true;
    arbeiderRedusert: false;
}
interface ArbeidISøknadsperiodeEnkeltdagerSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderEnkeltdager;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    enkeltdager: DateDurationMap;
}
interface ArbeidISøknadsperiodeTimerFasteUkedagerSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderFasteUkedager;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    fasteDager: DurationWeekdays;
}
interface ArbeidISøknadsperiodeSnittTimerPerUkeSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderSnittTimerPerUke;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    snittTimerPerUke: number;
}
interface ArbeidISøknadsperiodeProsentSøknadsdata {
    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt;
    arbeiderIPerioden: true;
    arbeiderRedusert: true;
    prosentAvNormalt: number;
}

export type ArbeidIPeriodeSøknadsdata =
    | ArbeidISøknadsperiodeJobberVanligSøknadsdata
    | ArbeidISøknadsperiodeJobberIkkeSøknadsdata
    | ArbeidISøknadsperiodeEnkeltdagerSøknadsdata
    | ArbeidISøknadsperiodeTimerFasteUkedagerSøknadsdata
    | ArbeidISøknadsperiodeSnittTimerPerUkeSøknadsdata
    | ArbeidISøknadsperiodeProsentSøknadsdata;

export interface Søknadsdata {
    søknadsperiode?: DateRange;
    arbeid?: ArbeidSøknadsdata;
}
