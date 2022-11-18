import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType } from '../Arbeidsgiver';
import { FrilansoppdragType } from '../FrilansoppdragFormData';
import { ArbeidsforholdApiData } from './arbeidsforholdApiData';

export enum FrilansoppdragIPeriodenApi {
    JA = 'JA',
    JA_MEN_AVSLUTTES_I_PERIODEN = 'JA_MEN_AVSLUTTES_I_PERIODEN',
    NEI = 'NEI',
}
export interface FrilanserApiData {
    type: ArbeidsgiverType;
    navn: string;
    organisasjonsnummer?: string;
    offentligIdent?: string;
    ansattFom?: ISODate;
    ansattTom?: ISODate;
    oppdragType?: FrilansoppdragType;
    manuellOppføring?: boolean;
    styremedlemHeleInntekt?: boolean;
    harOppdragIPerioden?: FrilansoppdragIPeriodenApi;
    arbeidsforhold?: ArbeidsforholdApiData;
}

export interface IngenFrilanserOppdragApi {
    harInntektSomFrilanser: false;
    oppdrag: [];
}

export interface HarFrilanserOppdragApi {
    harInntektSomFrilanser: true;
    oppdrag: FrilanserApiData[];
}

export type FrilanserOppdragApiData = IngenFrilanserOppdragApi | HarFrilanserOppdragApi;
