import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType } from '../Arbeidsgiver';
import { FrilanserOppdragType } from '../FrilansFormData';
import { ArbeidsforholdApiData } from './arbeidsforholdApiData';

export enum FrilanserOppdragIPeriodenApi {
    JA = 'JA',
    JA_MEN_AVSLUTTES_I_PERIODEN = 'JA_MEN_AVSLUTTES_I_PERIODEN',
    NEI = 'NEI',
}

export interface FrilanserApiData {
    type: ArbeidsgiverType;
    navn: string;
    organisasjonsnummer?: string;
    offentligIdent?: string;
    oppdragType?: FrilanserOppdragType;
    manuellOppføring?: boolean;
    ansattFom?: ISODate;
    ansattTom?: ISODate;
    styremedlemHeleInntekt?: boolean;
    harOppdragIPerioden?: FrilanserOppdragIPeriodenApi;
    arbeidsforhold?: ArbeidsforholdApiData;
}

export interface FrilanserOppdragApi {
    harInntektSomFrilanser: boolean;
    oppdrag: FrilanserApiData[];
}
