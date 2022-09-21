import { ISODate } from '@navikt/sif-common-utils/lib';
import { ArbeidsforholdApiData } from './arbeidsforholdApiData';

export function isFrilansApiDataMedArbeidsforhold(
    frilansApiData: FrilansApiData
): frilansApiData is FrilansApiDataHarInntekt {
    const { harInntektSomFrilanser } = frilansApiData;
    if (!harInntektSomFrilanser) {
        return false;
    }
    const { mottarFosterhjemsgodtgjørelse, harAndreOppdragEnnFosterhjemsgodtgjørelse } = frilansApiData;
    if (mottarFosterhjemsgodtgjørelse === true && harAndreOppdragEnnFosterhjemsgodtgjørelse === false) {
        return false;
    }

    return true;
}

export interface FrilansApiDataIngenInntekt {
    harInntektSomFrilanser: false;
}
export interface FrilansApiDataKunFosterhjemsgodtgjørelse {
    harInntektSomFrilanser: true;
    mottarFosterhjemsgodtgjørelse: true;
    harAndreOppdragEnnFosterhjemsgodtgjørelse: false;
    startdato: ISODate;
}

export interface FrilansApiDataSluttetFørSøknadsperiode {
    harInntektSomFrilanser: false;
    startdato: ISODate;
    jobberFortsattSomFrilans: false;
    sluttdato?: ISODate;
}
export interface FrilansApiDataHarInntekt {
    harInntektSomFrilanser: true;
    startdato: ISODate;
    jobberFortsattSomFrilans: boolean;
    sluttdato?: ISODate;
    arbeidsforhold: ArbeidsforholdApiData;
    mottarFosterhjemsgodtgjørelse: boolean;
    harAndreOppdragEnnFosterhjemsgodtgjørelse?: boolean;
}

export type FrilansApiData =
    | FrilansApiDataIngenInntekt
    | FrilansApiDataKunFosterhjemsgodtgjørelse
    | FrilansApiDataSluttetFørSøknadsperiode
    | FrilansApiDataHarInntekt;
