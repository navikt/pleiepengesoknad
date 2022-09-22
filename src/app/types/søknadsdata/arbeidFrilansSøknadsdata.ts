import { DateRange } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdSøknadsdata } from './arbeidsforholdSøknadsdata';

export enum ArbeidFrilansSøknadsdataType {
    'erIkkeFrilanser' = 'erIkkeFrilanser',
    'kunFosterhjemsgodtgjørelse' = 'kunFosterhjemsgodtgjørelse',
    'pågående' = 'pågående',
    'avsluttetISøknadsperiode' = 'avsluttetISøknadsperiode',
    'avsluttetFørSøknadsperiode' = 'avsluttetFørSøknadsperiode',
}

export type ArbeidFrilansMedArbeidsforhold = {
    type: ArbeidFrilansSøknadsdataType;
    erFrilanser: true;
    harInntektISøknadsperiode: true;
    startdato: Date;
    aktivPeriode: DateRange;
    arbeidsforhold: ArbeidsforholdSøknadsdata;
    mottarFosterhjemsgodtgjørelse: boolean;
    harAndreOppdragEnnFosterhjemsgodtgjørelse?: boolean;
    harKunSmåoppdrag: boolean;
};

export interface ArbeidFrilansSøknadsdataErIkkeFrilanser {
    type: ArbeidFrilansSøknadsdataType.erIkkeFrilanser;
    erFrilanser: false;
}

export interface ArbeidFrilansSøknadsdataKunFosterhjemsgodtgjørelse {
    type: ArbeidFrilansSøknadsdataType.kunFosterhjemsgodtgjørelse;
    mottarFosterhjemsgodtgjørelse: true;
    harAndreOppdragEnnFosterhjemsgodtgjørelse: false;
    erFrilanser: true;
    erFortsattFrilanser: boolean;
    startdato: Date;
    sluttdato?: Date;
}
export interface ArbeidFrilansSøknadsdataPågående extends ArbeidFrilansMedArbeidsforhold {
    type: ArbeidFrilansSøknadsdataType.pågående;
    erFortsattFrilanser: true;
}

export interface ArbeidFrilansSøknadsdataAvsluttetISøknadsperiode extends ArbeidFrilansMedArbeidsforhold {
    type: ArbeidFrilansSøknadsdataType.avsluttetISøknadsperiode;
    erFortsattFrilanser: false;
    sluttdato: Date;
}

export interface ArbeidFrilansSøknadsdataUtenforSøknadsperiode {
    type: ArbeidFrilansSøknadsdataType.avsluttetFørSøknadsperiode;
    erFrilanser: false;
    harInntektISøknadsperiode: false;
    startdato: Date;
    sluttdato: Date;
}

export type ArbeidFrilansSøknadsdata =
    | ArbeidFrilansSøknadsdataErIkkeFrilanser
    | ArbeidFrilansSøknadsdataKunFosterhjemsgodtgjørelse
    | ArbeidFrilansSøknadsdataPågående
    | ArbeidFrilansSøknadsdataUtenforSøknadsperiode
    | ArbeidFrilansSøknadsdataAvsluttetISøknadsperiode;
