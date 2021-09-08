import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import {
    ArbeidsforholdApi,
    ArbeidsforholdApiNei,
    ArbeidsforholdApiRedusert,
    ArbeidsforholdApiSomVanlig,
    ArbeidsforholdApiVetIkke,
    ArbeidsforholdType,
    SkalJobbe,
} from '../../types/PleiepengesøknadApiData';
import {
    Arbeidsforhold,
    ArbeidsforholdAnsatt,
    ArbeidsforholdSkalJobbeHvorMyeSvar,
    ArbeidsforholdSkalJobbeSvar,
    isArbeidsforholdAnsatt,
} from '../../types/PleiepengesøknadFormData';
import { calcRedusertProsentFromRedusertTimer } from '../arbeidsforholdUtils';

export const mapArbeidsforholdToApiData = (
    arbeidsforhold: Arbeidsforhold | ArbeidsforholdAnsatt,
    type: ArbeidsforholdType
): ArbeidsforholdApi | undefined => {
    const {
        skalJobbe,
        timerEllerProsent,
        jobberNormaltTimer,
        skalJobbeTimer,
        skalJobbeProsent,
        arbeidsform,
        skalJobbeHvorMye,
    } = arbeidsforhold;

    const erAnsatt = isArbeidsforholdAnsatt(arbeidsforhold) ? arbeidsforhold.erAnsatt === YesOrNo.YES : undefined;
    const sluttdato = isArbeidsforholdAnsatt(arbeidsforhold)
        ? datepickerUtils.getDateFromDateString(arbeidsforhold.sluttdato)
        : undefined;

    const commonData: Pick<ArbeidsforholdApi, 'arbeidsform' | 'erAnsatt' | 'sluttdato' | '_type'> = {
        arbeidsform,
        erAnsatt,
        sluttdato,
        _type: type,
    };
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined || skalJobbe === undefined) {
        return {
            _type: type,
        };
    }

    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.nei) {
        const forhold: ArbeidsforholdApiNei = {
            ...commonData,
            skalJobbe: SkalJobbe.NEI,
            skalJobbeProsent: 0,
            jobberNormaltTimer: jobberNormaltTimerNumber,
            _type: type,
        };
        return forhold;
    }

    if (
        skalJobbe === ArbeidsforholdSkalJobbeSvar.ja &&
        skalJobbeHvorMye === ArbeidsforholdSkalJobbeHvorMyeSvar.redusert
    ) {
        const skalJobbeTimerNumber = getNumberFromNumberInputValue(skalJobbeTimer);
        const skalJobbeProsentNumber = getNumberFromNumberInputValue(skalJobbeProsent);

        if (skalJobbeTimerNumber === undefined && skalJobbeProsent === undefined) {
            return undefined;
        }
        const redusertForhold: ArbeidsforholdApiRedusert = {
            ...commonData,
            skalJobbe: SkalJobbe.REDUSERT,
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
            ...commonData,
            skalJobbe: SkalJobbe.VET_IKKE,
            jobberNormaltTimer: jobberNormaltTimerNumber,
            skalJobbeProsent: 0,
        };
        return vetIkkeForhold;
    }
    const forholdSomVanlig: ArbeidsforholdApiSomVanlig = {
        ...commonData,
        skalJobbe: SkalJobbe.JA,
        skalJobbeProsent: 100,
        jobberNormaltTimer: jobberNormaltTimerNumber,
    };
    return forholdSomVanlig;
};
