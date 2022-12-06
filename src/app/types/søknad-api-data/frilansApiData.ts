import { ISODate } from '@navikt/sif-common-utils/lib';
import { FrilansTyper } from '../FrilansFormData';
import { ArbeidsforholdFrilansApiData } from './arbeidsforholdFrilansApiData';

export interface FrilansApiDataIngenInntekt {
    type: 'ingenIntekt';
    harInntektSomFrilanser: false;
}

export interface FrilansApiDataVervIkkeMisterHonorar {
    type: 'harIkkeArbeidsforhold';
    harInntektSomFrilanser: true;
    frilansTyper: [FrilansTyper.STYREVERV];
    misterHonorar: false;
}

export interface FrilansApiDataHarInntekt {
    type: 'harArbeidsforhold';
    harInntektSomFrilanser: true;
    startdato: ISODate;
    frilansTyper: FrilansTyper[];
    misterHonorar?: boolean;
    arbeidsforhold: ArbeidsforholdFrilansApiData;
}
export type FrilansApiData =
    | FrilansApiDataIngenInntekt
    | FrilansApiDataHarInntekt
    | FrilansApiDataVervIkkeMisterHonorar;
