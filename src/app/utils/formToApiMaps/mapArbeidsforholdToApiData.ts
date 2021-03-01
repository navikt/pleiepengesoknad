import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import {
    ArbeidsforholdApi,
    ArbeidsforholdApiNei,
    ArbeidsforholdApiRedusert,
    ArbeidsforholdApiSomVanlig,
    ArbeidsforholdApiVetIkke,
} from '../../types/PleiepengesøknadApiData';
import { Arbeidsforhold, ArbeidsforholdSkalJobbeSvar } from '../../types/PleiepengesøknadFormData';
import { calcRedusertProsentFromRedusertTimer } from '../arbeidsforholdUtils';

export const mapArbeidsforholdToApiData = (arbeidsforhold: Arbeidsforhold): ArbeidsforholdApi | undefined => {
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
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined) {
        return undefined;
    }

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.nei) {
        const forhold: ArbeidsforholdApiNei = {
            ...commonOrgInfo,
            skalJobbe: 'nei',
            skalJobbeProsent: 0,
            jobberNormaltTimer: jobberNormaltTimerNumber,
        };
        return forhold;
    }

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert) {
        const skalJobbeTimerNumber = getNumberFromNumberInputValue(skalJobbeTimer);
        const skalJobbeProsentNumber = getNumberFromNumberInputValue(skalJobbeProsent);

        if (skalJobbeTimerNumber === undefined && skalJobbeProsent === undefined) {
            return undefined;
        }
        const redusertForhold: ArbeidsforholdApiRedusert = {
            ...commonOrgInfo,
            skalJobbe: 'redusert',
            jobberNormaltTimer: jobberNormaltTimerNumber,
            ...(timerEllerProsent === 'timer' && skalJobbeTimer
                ? {
                      skalJobbeTimer: skalJobbeTimerNumber,
                      skalJobbeProsent:
                          jobberNormaltTimer !== undefined && skalJobbeTimerNumber !== undefined
                              ? calcRedusertProsentFromRedusertTimer(jobberNormaltTimerNumber, skalJobbeTimerNumber)
                              : 0,
                  }
                : {
                      skalJobbeProsent: skalJobbeProsentNumber,
                  }),
        };
        return redusertForhold;
    }
    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.vetIkke) {
        const vetIkkeForhold: ArbeidsforholdApiVetIkke = {
            ...commonOrgInfo,
            skalJobbe: 'vetIkke',
            jobberNormaltTimer: jobberNormaltTimerNumber,
            skalJobbeProsent: 0,
        };
        return vetIkkeForhold;
    }
    const forholdSomVanlig: ArbeidsforholdApiSomVanlig = {
        ...commonOrgInfo,
        skalJobbe: 'ja',
        skalJobbeProsent: 100,
        jobberNormaltTimer: jobberNormaltTimerNumber,
    };
    return forholdSomVanlig;
};
