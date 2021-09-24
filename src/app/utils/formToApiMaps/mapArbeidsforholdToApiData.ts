import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdType } from '../../types';
import { ArbeidIPeriodeApiData, ArbeidsforholdApiData } from '../../types/PleiepengesøknadApiData';
import { ArbeidIPeriode, Arbeidsforhold } from '../../types/PleiepengesøknadFormData';
import {
    getEnkeltdagerIPeriodeApiData,
    getFasteDagerApiData,
    getHistoriskPeriode,
    getPlanlagtPeriode,
} from '../tidsbrukUtils';

export const mapArbeidIPeriodeToApiData = (arbeid: ArbeidIPeriode, periode: DateRange): ArbeidIPeriodeApiData => {
    return {
        jobber: arbeid.jobber,
        jobberSomVanlig: arbeid.jobberSomVanlig === YesOrNo.YES,
        enkeltdager: arbeid.enkeltdager ? getEnkeltdagerIPeriodeApiData(arbeid.enkeltdager, periode) : undefined,
        fasteDager: arbeid.fasteDager ? getFasteDagerApiData(arbeid.fasteDager) : undefined,
    };
};

export const mapArbeidsforholdToApiData = (
    arbeidsforhold: Arbeidsforhold,
    søknadsperiode: DateRange,
    type: ArbeidsforholdType,
    erAktivt = true
): ArbeidsforholdApiData => {
    const { jobberNormaltTimer, arbeidsform } = arbeidsforhold;
    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);

    if (jobberNormaltTimerNumber === undefined || arbeidsform === undefined) {
        throw new Error('mapArbeidsforholdToApiData');
    }

    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, dateToday);
    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, dateToday);

    return {
        _type: type,
        jobberNormaltTimer: jobberNormaltTimerNumber,
        arbeidsform,
        historiskArbeid:
            periodeFørSøknadsdato && arbeidsforhold.historisk
                ? mapArbeidIPeriodeToApiData(arbeidsforhold.historisk, periodeFørSøknadsdato)
                : undefined,
        planlagtArbeid:
            periodeFraOgMedSøknadsdato && arbeidsforhold.planlagt
                ? mapArbeidIPeriodeToApiData(arbeidsforhold.planlagt, periodeFraOgMedSøknadsdato)
                : undefined,
        erAktivt,
    };
};
