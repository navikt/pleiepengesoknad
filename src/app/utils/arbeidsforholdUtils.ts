import { Arbeidsgiver } from 'app/types/Søkerdata';
import { Arbeidsforhold } from 'app/types/PleiepengesøknadFormData';
import { YesOrNo } from 'common/types/YesOrNo';

const roundWithTwoDecimals = (nbr: number): number => Math.round(nbr * 100) / 100;

export const calcRedusertProsentFromRedusertTimer = (timerNormalt: number, timerRedusert: number): number => {
    return roundWithTwoDecimals((100 / timerNormalt) * timerRedusert);
};

export const calcReduserteTimerFromRedusertProsent = (timerNormalt: number, prosentRedusert: number): number => {
    return roundWithTwoDecimals((timerNormalt / 100) * prosentRedusert);
};

export const syndArbeidsforholdWithArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: Arbeidsforhold[]
): Arbeidsforhold[] => {
    return arbeidsgivere.map((organisasjon) => ({
        ...organisasjon,
        ...arbeidsforhold.find((f) => f.organisasjonsnummer === organisasjon.organisasjonsnummer)
    }));
};

export const getAktiveArbeidsforholdIPerioden = (arbeidsforhold: Arbeidsforhold[]) => {
    return arbeidsforhold.filter((a) => a.erAnsattIPerioden === YesOrNo.YES);
};
