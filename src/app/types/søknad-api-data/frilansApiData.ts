import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdApiData } from './arbeidsforholdApiData';

export interface FrilansApiDataIngenInntekt {
    harInntektSomFrilanser: false;
}
export interface FrilansApiDataSluttetFørSøknadsperiode {
    harInntektSomFrilanser: false;
    startdato: ISODate;
    erFortsattFrilanser: false;
    sluttdato?: ISODate;
}
export interface FrilansApiDataHarInntekt {
    harInntektSomFrilanser: true;
    startdato: ISODate;
    erFortsattFrilanser: boolean;
    sluttdato?: ISODate;
    arbeidsforhold: ArbeidsforholdApiData;
}
export type FrilansApiData =
    | FrilansApiDataIngenInntekt
    | FrilansApiDataSluttetFørSøknadsperiode
    | FrilansApiDataHarInntekt;
