import {
    ArbeidsforholdApi,
    ArbeidsforholdApiNei,
    ArbeidsforholdApiRedusert,
    ArbeidsforholdApiSomVanlig,
    ArbeidsforholdApiVetIkke
} from '../../types/PleiepengesøknadApiData';
import { Arbeidsforhold, ArbeidsforholdSkalJobbeSvar } from '../../types/PleiepengesøknadFormData';
import { calcRedusertProsentFromRedusertTimer } from '../arbeidsforholdUtils';

export const mapArbeidsforholdToApiData = (arbeidsforhold: Arbeidsforhold): ArbeidsforholdApi => {
    const {
        skalJobbe,
        timerEllerProsent,
        jobberNormaltTimer,
        skalJobbeTimer,
        skalJobbeProsent,
        navn,
        organisasjonsnummer
    } = arbeidsforhold;

    const orgInfo = { navn, organisasjonsnummer };

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.nei) {
        const forhold: ArbeidsforholdApiNei = {
            ...orgInfo,
            skalJobbe: 'nei',
            skalJobbeProsent: 0,
            jobberNormaltTimer
        };
        return forhold;
    }

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert) {
        const redusertForhold: ArbeidsforholdApiRedusert = {
            ...orgInfo,
            skalJobbe: 'redusert',
            jobberNormaltTimer,
            ...(timerEllerProsent === 'timer' && skalJobbeTimer
                ? {
                      skalJobbeTimer,
                      skalJobbeProsent: jobberNormaltTimer
                          ? calcRedusertProsentFromRedusertTimer(jobberNormaltTimer, skalJobbeTimer)
                          : 0
                  }
                : {
                      skalJobbeProsent
                  })
        };
        return redusertForhold;
    }
    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.vetIkke) {
        const vetIkkeForhold: ArbeidsforholdApiVetIkke = {
            ...orgInfo,
            skalJobbe: 'vetIkke',
            jobberNormaltTimer,
            skalJobbeProsent: 0
        };
        return vetIkkeForhold;
    }
    const forholdSomVanlig: ArbeidsforholdApiSomVanlig = {
        ...orgInfo,
        skalJobbe: 'ja',
        skalJobbeProsent: 100,
        jobberNormaltTimer
    };
    return forholdSomVanlig;
};
