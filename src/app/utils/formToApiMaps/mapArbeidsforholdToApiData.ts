import {
    ArbeidsforholdApi,
    ArbeidsforholdApiNei,
    ArbeidsforholdApiRedusert,
    ArbeidsforholdApiSomVanlig,
    ArbeidsforholdApiVetIkke,
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
        organisasjonsnummer,
        arbeidsform,
    } = arbeidsforhold;

    const commonOrgInfo = { navn, organisasjonsnummer, arbeidsform };

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.nei) {
        const forhold: ArbeidsforholdApiNei = {
            ...commonOrgInfo,
            skalJobbe: 'nei',
            skalJobbeProsent: 0,
            jobberNormaltTimer,
        };
        return forhold;
    }

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert) {
        const redusertForhold: ArbeidsforholdApiRedusert = {
            ...commonOrgInfo,
            skalJobbe: 'redusert',
            jobberNormaltTimer,
            ...(timerEllerProsent === 'timer' && skalJobbeTimer
                ? {
                      skalJobbeTimer,
                      skalJobbeProsent: jobberNormaltTimer
                          ? calcRedusertProsentFromRedusertTimer(jobberNormaltTimer, skalJobbeTimer)
                          : 0,
                  }
                : {
                      skalJobbeProsent,
                  }),
        };
        return redusertForhold;
    }
    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.vetIkke) {
        const vetIkkeForhold: ArbeidsforholdApiVetIkke = {
            ...commonOrgInfo,
            skalJobbe: 'vetIkke',
            jobberNormaltTimer,
            skalJobbeProsent: 0,
        };
        return vetIkkeForhold;
    }
    const forholdSomVanlig: ArbeidsforholdApiSomVanlig = {
        ...commonOrgInfo,
        skalJobbe: 'ja',
        skalJobbeProsent: 100,
        jobberNormaltTimer,
    };
    return forholdSomVanlig;
};
