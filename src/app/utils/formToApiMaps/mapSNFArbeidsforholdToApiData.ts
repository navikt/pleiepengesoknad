import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import {
    ArbeidsforholdSNFApi,
    ArbeidsforholdSNFApiNei,
    ArbeidsforholdSNFApiRedusert,
    ArbeidsforholdSNFApiSomVanlig,
    ArbeidsforholdSNFApiVetIkke,
} from '../../types/PleiepengesøknadApiData';
import { ArbeidsforholdSNF, ArbeidsforholdSkalJobbeSvar } from '../../types/PleiepengesøknadFormData';
import { calcRedusertProsentFromRedusertTimer } from '../arbeidsforholdUtils';

export const mapSNFArbeidsforholdToApiData = (
    frilansArbeidsforhold: ArbeidsforholdSNF
): ArbeidsforholdSNFApi | undefined => {
    const {
        skalJobbe,
        timerEllerProsent,
        jobberNormaltTimer,
        skalJobbeTimer,
        skalJobbeProsent,
        arbeidsform,
    } = frilansArbeidsforhold;

    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined) {
        return undefined;
    }

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.nei) {
        const forhold: ArbeidsforholdSNFApiNei = {
            ...{ arbeidsform },
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
        const redusertForhold: ArbeidsforholdSNFApiRedusert = {
            ...{ arbeidsform },
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
        const vetIkkeForhold: ArbeidsforholdSNFApiVetIkke = {
            ...{ arbeidsform },
            skalJobbe: 'vetIkke',
            jobberNormaltTimer: jobberNormaltTimerNumber,
            skalJobbeProsent: 0,
        };
        return vetIkkeForhold;
    }
    const forholdSomVanlig: ArbeidsforholdSNFApiSomVanlig = {
        ...{ arbeidsform },
        skalJobbe: 'ja',
        skalJobbeProsent: 100,
        jobberNormaltTimer: jobberNormaltTimerNumber,
    };
    return forholdSomVanlig;
};