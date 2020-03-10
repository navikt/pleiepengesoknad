import {
    ArbeidsforholdApi, ArbeidsforholdApiNei, ArbeidsforholdApiRedusert, ArbeidsforholdApiSomVanlig,
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
            skal_jobbe: 'nei',
            skal_jobbe_prosent: 0,
            jobber_normalt_timer: jobberNormaltTimer
        };
        return forhold;
    }

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert) {
        const redusertForhold: ArbeidsforholdApiRedusert = {
            ...orgInfo,
            skal_jobbe: 'redusert',
            jobber_normalt_timer: jobberNormaltTimer,
            ...(timerEllerProsent === 'timer' && skalJobbeTimer
                ? {
                      skal_jobbe_timer: skalJobbeTimer,
                      skal_jobbe_prosent: jobberNormaltTimer
                          ? calcRedusertProsentFromRedusertTimer(jobberNormaltTimer, skalJobbeTimer)
                          : 0
                  }
                : {
                      skal_jobbe_prosent: skalJobbeProsent
                  })
        };
        return redusertForhold;
    }
    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.vetIkke) {
        const vetIkkeForhold: ArbeidsforholdApiVetIkke = {
            ...orgInfo,
            skal_jobbe: 'vet_ikke',
            jobber_normalt_timer: jobberNormaltTimer
        };
        return vetIkkeForhold;
    }
    const forholdSomVanlig: ArbeidsforholdApiSomVanlig = {
        ...orgInfo,
        skal_jobbe: 'ja',
        skal_jobbe_prosent: 100,
        jobber_normalt_timer: jobberNormaltTimer
    };
    return forholdSomVanlig;
};
