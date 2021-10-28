import { IntlShape } from 'react-intl';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { FormikProps } from 'formik';
import { getArbeidsgiver } from '../api/api';
import { AppFormField, ArbeidsforholdAnsatt, PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { Arbeidsgiver, Søkerdata } from '../types/Søkerdata';
import { apiUtils } from './apiUtils';
import appSentryLogger from './appSentryLogger';
import { relocateToLoginPage } from './navigationUtils';

const roundWithTwoDecimals = (nbr: number): number => Math.round(nbr * 100) / 100;

export const calcRedusertProsentFromRedusertTimer = (timerNormalt: number, timerRedusert: number): number => {
    return roundWithTwoDecimals((100 / timerNormalt) * timerRedusert);
};

export const calcReduserteTimerFromRedusertProsent = (timerNormalt: number, prosentRedusert: number): number => {
    return roundWithTwoDecimals((timerNormalt / 100) * prosentRedusert);
};

export const syncArbeidsforholdWithArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: ArbeidsforholdAnsatt[]
): Array<Partial<ArbeidsforholdAnsatt>> => {
    return arbeidsgivere.map((organisasjon) => {
        const forhold: ArbeidsforholdAnsatt | undefined = arbeidsforhold.find(
            (f) => f.organisasjonsnummer === organisasjon.organisasjonsnummer
        );
        return {
            ...organisasjon,
            ...forhold,
        };
    });
};

export const updateArbeidsforhold = (
    formikProps: FormikProps<PleiepengesøknadFormData>,
    arbeidsgivere: Arbeidsgiver[]
) => {
    const updatedArbeidsforhold = syncArbeidsforholdWithArbeidsgivere(
        arbeidsgivere,
        formikProps.values[AppFormField.ansatt_arbeidsforhold]
    );
    if (updatedArbeidsforhold.length > 0) {
        formikProps.setFieldValue(AppFormField.ansatt_arbeidsforhold, updatedArbeidsforhold);
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
            relocateToLoginPage();
        } else {
            appSentryLogger.logApiError(error);
        }
    }
}

export const getTimerTekst = (intl: IntlShape, value: string | undefined): string => {
    const timer = getNumberFromNumberInputValue(value);
    if (timer) {
        return intlHelper(intl, 'timer', {
            timer,
        });
    }
    return intlHelper(intl, 'timer.ikkeTall', {
        timer: value,
    });
};
