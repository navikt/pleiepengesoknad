import { ISODate } from '@navikt/sif-common-utils/lib';
import { MisterHonorarerFraVervIPerioden } from '../ArbeidIPeriodeFormValues';
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
    misterHonorarer: false;
}

export interface FrilansApiDataHarInntekt {
    type: 'harArbeidsforhold';
    harInntektSomFrilanser: true;
    startdato: ISODate;
    frilansTyper: FrilansTyper[];
    misterHonorarer?: boolean;
    misterHonorarerIPerioden?: MisterHonorarerFraVervIPerioden;
    arbeidsforhold: ArbeidsforholdFrilansApiData;
}
export type FrilansApiData =
    | FrilansApiDataIngenInntekt
    | FrilansApiDataHarInntekt
    | FrilansApiDataVervIkkeMisterHonorar;
