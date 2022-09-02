import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType } from '../Arbeidsgiver';
import { ArbeidsforholdApiData } from './arbeidsforholdApiData';

export interface ArbeidsgiverApiData {
    type: ArbeidsgiverType;
    navn: string;
    organisasjonsnummer?: string;
    offentligIdent?: string;
    ansattFom?: ISODate;
    ansattTom?: ISODate;
    erAnsatt: boolean;
    sluttetFørSøknadsperiode?: boolean;
    arbeidsforhold?: ArbeidsforholdApiData;
}

export type OrganisasjonArbeidsgiverApiData = Omit<ArbeidsgiverApiData, 'offentligIdent' | 'organisasjonsnummer'> & {
    type: ArbeidsgiverType.ORGANISASJON;
    organisasjonsnummer: string;
};

/**
 * interface ArbeidsgiverApiDataBase {
    navn: string;
    ansattFom?: ISODate;
    ansattTom?: ISODate;
    erAnsatt: boolean;
    sluttetFørSøknadsperiode?: boolean;
    arbeidsforhold?: ArbeidsforholdApiData;
}

export type OrganisasjonArbeidsgiverApiData = ArbeidsgiverApiDataBase & {
    type: ArbeidsgiverType.ORGANISASJON;
    organisasjonsnummer: string;
};

export type FrilansoppdragArbeidsgiverApiData = ArbeidsgiverApiDataBase & {
    type: ArbeidsgiverType.FRILANSOPPDRAG;
    organisasjonsnummer?: string;
    offentligIdent?: string;
};

export type PrivatpersonArbeidsgiverApiData = ArbeidsgiverApiDataBase & {
    type: ArbeidsgiverType.PRIVATPERSON;
    offentligIdent: string;
};

export type ArbeidsgiverApiData =
    | OrganisasjonArbeidsgiverApiData
    | FrilansoppdragArbeidsgiverApiData
    | PrivatpersonArbeidsgiverApiData;

 */
