import { FormikProps } from 'formik';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import { formatDateToApiFormat } from '@sif-common/core/utils/dateUtils';
import { getArbeidsgiver } from 'app/api/api';
import { AppFormField, Arbeidsforhold, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import { Søkerdata } from 'app/types/Søkerdata';
import { apiUtils } from './apiUtils';
import appSentryLogger from './appSentryLogger';
import { navigateToLoginPage } from './navigationUtils';
import { Arbeidsgiver } from '../types/ArbeidsgiverResponse';

const roundWithTwoDecimals = (nbr: number): number => Math.round(nbr * 100) / 100;

export const calcRedusertProsentFromRedusertTimer = (timerNormalt: number, timerRedusert: number): number => {
    return roundWithTwoDecimals((100 / timerNormalt) * timerRedusert);
};

export const calcReduserteTimerFromRedusertProsent = (timerNormalt: number, prosentRedusert: number): number => {
    return roundWithTwoDecimals((timerNormalt / 100) * prosentRedusert);
};

export const syncArbeidsforholdWithArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: Arbeidsforhold[]
): Array<Partial<Arbeidsforhold>> => {
    return arbeidsgivere.map((organisasjon) => {
        const forhold: Arbeidsforhold | undefined = arbeidsforhold.find(
            (f) => f.organisasjonsnummer === organisasjon.organisasjonsnummer
        );
        return {
            ...organisasjon,
            ...forhold,
        };
    });
};

export const getAktiveArbeidsforholdIPerioden = (arbeidsforhold: Arbeidsforhold[]) => {
    return arbeidsforhold.filter((a) => a.erAnsattIPerioden === YesOrNo.YES);
};

export const updateArbeidsforhold = (
    formikProps: FormikProps<PleiepengesøknadFormData>,
    arbeidsgivere: Arbeidsgiver[]
) => {
    const updatedArbeidsforhold = syncArbeidsforholdWithArbeidsgivere(
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
    try {
        const response = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
        const { organisasjoner } = response.data;
        søkerdata.setArbeidsgivere(organisasjoner);
        updateArbeidsforhold(formikProps, organisasjoner);
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        } else {
            appSentryLogger.logApiError(error);
        }
    }
}
