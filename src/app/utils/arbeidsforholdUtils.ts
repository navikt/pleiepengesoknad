import { FormikProps } from 'formik';
import { YesOrNo } from 'common/types/YesOrNo';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { getArbeidsgiver } from 'app/api/api';
import demoSøkerdata from 'app/demo/demoData';
import {
    AppFormField, Arbeidsforhold, PleiepengesøknadFormData
} from 'app/types/PleiepengesøknadFormData';
import { Arbeidsgiver, Søkerdata } from 'app/types/Søkerdata';
import { apiUtils } from './apiUtils';
import { appIsRunningInDemoMode } from './envUtils';
import { navigateToLoginPage } from './navigationUtils';

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

export const updateArbeidsforhold = (
    formikProps: FormikProps<PleiepengesøknadFormData>,
    arbeidsgivere: Arbeidsgiver[]
) => {
    const updatedArbeidsforhold = syndArbeidsforholdWithArbeidsgivere(
        arbeidsgivere,
        formikProps.values[AppFormField.arbeidsforhold]
    );
    if (updatedArbeidsforhold.length > 0) {
        formikProps.setFieldValue(AppFormField.arbeidsforhold, updatedArbeidsforhold);
    }
};

export async function getArbeidsgivere(
    fromDate: Date,
    toDate: Date,
    formikProps: FormikProps<PleiepengesøknadFormData>,
    søkerdata: Søkerdata
) {
    if (appIsRunningInDemoMode()) {
        søkerdata.setArbeidsgivere(demoSøkerdata.arbeidsgivere);
        updateArbeidsforhold(formikProps, demoSøkerdata.arbeidsgivere);
        return;
    }
    try {
        const response = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
        const { organisasjoner } = response.data;
        søkerdata.setArbeidsgivere!(organisasjoner);
        updateArbeidsforhold(formikProps, organisasjoner);
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        }
    }
}
