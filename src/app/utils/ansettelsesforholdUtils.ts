import { Ansettelsesforhold } from 'app/types/Søkerdata';
import { AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';

const roundWithTwoDecimals = (nbr: number): number => Math.round(nbr * 100) / 100;

export const calcRedusertProsentFromRedusertTimer = (timerNormalt: number, timerRedusert: number): number => {
    return roundWithTwoDecimals((100 / timerNormalt) * timerRedusert);
};

export const calcReduserteTimerFromRedusertProsent = (timerNormalt: number, prosentRedusert: number): number => {
    return roundWithTwoDecimals((timerNormalt / 100) * prosentRedusert);
};

export const syncAnsettelsesforholdInFormDataWithSøkerdata = (
    organisasjoner: Ansettelsesforhold[],
    ansettelsesforhold: AnsettelsesforholdForm[]
): AnsettelsesforholdForm[] => {
    return organisasjoner.map((organisasjon) => ({
        ...organisasjon,
        ...ansettelsesforhold.find((f) => f.organisasjonsnummer === organisasjon.organisasjonsnummer)
    }));
};
