import { ISODate } from '@navikt/sif-common-utils/lib';
import { FrilansType } from '../FrilansFormData';
import { ArbeidsforholdFrilansApiData } from './arbeidsforholdFrilansApiData';

export interface FrilansApiDataIngenInntekt {
    type: 'ingenIntekt';
    harInntektSomFrilanser: false;
}

export interface FrilansApiDataVervIkkeMisterHonorar {
    type: 'harIkkeArbeidsforhold';
    harInntektSomFrilanser: true;
    frilansTyper: [FrilansType.STYREVERV];
    misterHonorar: false;
}

export interface FrilansApiDataHarInntekt {
    type: 'harArbeidsforhold';
    harInntektSomFrilanser: true;
    startdato: ISODate;
    frilansTyper: FrilansType[];
    misterHonorar?: boolean;
    arbeidsforhold: ArbeidsforholdFrilansApiData;
}
export type FrilansApiData =
    | FrilansApiDataIngenInntekt
    | FrilansApiDataHarInntekt
    | FrilansApiDataVervIkkeMisterHonorar;
