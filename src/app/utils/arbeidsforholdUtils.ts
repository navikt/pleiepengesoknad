import { IntlShape } from 'react-intl';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
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

export const getAktiveArbeidsforholdIPerioden = (arbeidsforhold: ArbeidsforholdAnsatt[]) => {
    return arbeidsforhold.filter((a) => a.erAnsatt === YesOrNo.YES);
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
            relocateToLoginPage();
        } else {
            appSentryLogger.logApiError(error);
        }
    }
}

export const getTimerTekst = (value: string | undefined, intl: IntlShape): string => {
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

/** */
export const harAvsluttetArbeidsforholdISøknadsperiode = (
    sluttdato: Date | undefined,
    søknadsperiode: DateRange
): boolean | undefined => {
    return sluttdato ? dayjs(sluttdato).isBetween(søknadsperiode.from, søknadsperiode.to, 'day', '[]') : undefined;
};

const harAvsluttetArbeidsforholdEtterSøknadsperiode = (
    sluttdato: Date | undefined,
    søknadsperiode: DateRange
): boolean | undefined => {
    return sluttdato ? dayjs(sluttdato).isAfter(søknadsperiode.to, 'day') : undefined;
};

export const arbeidsforholdGjelderSøknadsperiode = (
    arbeidsforhold: ArbeidsforholdAnsatt,
    søknadsperiode: DateRange
): boolean => {
    return (
        arbeidsforhold.erAnsatt === YesOrNo.YES ||
        (arbeidsforhold.erAnsatt === YesOrNo.NO &&
            (harAvsluttetArbeidsforholdISøknadsperiode(
                datepickerUtils.getDateFromDateString(arbeidsforhold.sluttdato),
                søknadsperiode
            ) === true ||
                harAvsluttetArbeidsforholdEtterSøknadsperiode(
                    datepickerUtils.getDateFromDateString(arbeidsforhold.sluttdato),
                    søknadsperiode
                ) === true))
    );
};

export const getArbeidsforholdISøknadsperiode = (
    arbeidsforhold: ArbeidsforholdAnsatt[],
    søknadsperiode: DateRange
): ArbeidsforholdAnsatt[] => {
    return arbeidsforhold.filter((a) => arbeidsforholdGjelderSøknadsperiode(a, søknadsperiode));
};

export const harAnsettelsesforholdISøknadsperiode = (
    arbeidsforhold: ArbeidsforholdAnsatt[],
    søknadsperiode: DateRange
): boolean => {
    return getArbeidsforholdISøknadsperiode(arbeidsforhold, søknadsperiode).length > 0;
};

export const getAktiveArbeidsforholdMedOpprinneligIndex = (
    arbeidsforhold: ArbeidsforholdAnsatt[],
    søknadsperiode: DateRange
) =>
    arbeidsforhold
        .map((a, index) => ({
            index,
            arbeidsforhold: a,
        }))
        .filter(
            (a) =>
                a.arbeidsforhold.erAnsatt === YesOrNo.YES ||
                (a.arbeidsforhold.erAnsatt === YesOrNo.NO &&
                    arbeidsforholdGjelderSøknadsperiode(a.arbeidsforhold, søknadsperiode))
        );
