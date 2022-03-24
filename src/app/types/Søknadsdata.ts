import { DateRange } from '@navikt/sif-common-formik/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver } from './Arbeidsgiver';

// export interface NormalarbeidstidSøknadsdataLiktHverUke {
//     erLiktHverUke: true;
//     fasteDager: DurationWeekdays;
//     timerPerUke: number;
// }
export interface NormalarbeidstidSøknadsdata {
    erLiktHverUke: boolean;
    fasteDager: DurationWeekdays;
    timerPerUke: number;
}
// export type NormalarbeidstidSøknadsdata = NormalarbeidstidSøknadsdataLiktHverUke | NormalarbeidstidSøknadsdataVarierer;

export interface ArbeidsforholdSøknadsdata {
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    harFraværIPeriode: boolean;
    arbeidISøknadsperiode?: ArbeidISøknadsperiodeSøknadsdata;
}

export interface ArbeidAnsattSøknadsdata {
    erAnsattISøknadsperiode: boolean;
    arbeidsgiver: Arbeidsgiver;
    arbeidsforhold?: ArbeidsforholdSøknadsdata;
}

export interface ArbeidFrilansSøknadsdataPågående {
    type: 'pågående';
    erFrilanserISøknadsperiode: true;
    erFortsattFrilanser: true;
    startdato: Date;
    aktivPeriode: DateRange;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}

export interface ArbeidFrilansSøknadsdataUtenforSøknadsperiode {
    type: 'utenforSøknadsperiode';
    erFrilanserISøknadsperiode: false;
    startdato: Date;
    sluttdato: Date;
}
export interface ArbeidFrilansSøknadsdataAvsluttet {
    type: 'avsluttet';
    erFrilanserISøknadsperiode: true;
    erFortsattFrilanser: false;
    startdato: Date;
    sluttdato: Date;
    aktivPeriode: DateRange;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
}

export type ArbeidFrilansSøknadsdata =
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
interface VariertArbeidISøknadsperiodeSøknadsdata {
    type: 'variert';
    skalArbeide: true;
    erLiktHverUke: false;
    enkeltdager: DateDurationMap;
}
interface FastArbeidISøknadsperiodeSøknadsdata {
    type: 'fastDager';
    skalArbeide: true;
    erLiktHverUke: true;
    fasteDager: DurationWeekdays;
}
interface FastArbeidProsentISøknadsperiodeSøknadsdata {
    type: 'fastProsent';
    skalArbeide: true;
    erLiktHverUke: true;
    fasteDager: DurationWeekdays;
    jobberProsent: number;
}

export type ArbeidISøknadsperiodeSøknadsdata =
    | IngenArbeidISøknadsperiodeSøknadsdata
    | VariertArbeidISøknadsperiodeSøknadsdata
    | FastArbeidISøknadsperiodeSøknadsdata
    | FastArbeidProsentISøknadsperiodeSøknadsdata;

export interface Søknadsdata {
    søknadsperiode?: DateRange;
    arbeid?: ArbeidSøknadsdata;
}
