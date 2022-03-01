import apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikProps } from 'formik';
import { getArbeidsgiver } from '../../../api/api';
import { arbeidsgivereMock } from '../../../mock-data/MockData';
import { Arbeidsgiver, Søkerdata } from '../../../types/Søkerdata';
import { ArbeidsforholdAnsatt, SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import appSentryLogger from '../../../utils/appSentryLogger';
import { Feature, isFeatureEnabled } from '../../../utils/featureToggleUtils';
import { relocateToLoginPage } from '../../../utils/navigationUtils';

export const syncArbeidsforholdWithArbeidsgivere = (
    arbeidsgivere: Arbeidsgiver[],
    arbeidsforhold: ArbeidsforholdAnsatt[]
): Array<Partial<ArbeidsforholdAnsatt>> => {
    return arbeidsgivere.map((organisasjon) => {
        const forhold: ArbeidsforholdAnsatt | undefined = arbeidsforhold.find(
            (f) => f.organisasjonsnummer === organisasjon.organisasjonsnummer
        );
        if (!organisasjon.navn) {
            appSentryLogger.logError(
                'Get arbeidsgiver: Manglende navn på organisasjon',
                `${JSON.stringify(organisasjon)}`
            );
        }
        return {
            ...organisasjon,
            ...forhold,
        };
    });
};

const updateArbeidsforholdFormField = (formikProps: FormikProps<SøknadFormData>, arbeidsgivere: Arbeidsgiver[]) => {
    const updatedArbeidsforhold = syncArbeidsforholdWithArbeidsgivere(
        arbeidsgivere,
        formikProps.values[SøknadFormField.ansatt_arbeidsforhold]
    );
    if (updatedArbeidsforhold.length > 0) {
        formikProps.setFieldValue(SøknadFormField.ansatt_arbeidsforhold, updatedArbeidsforhold);
    }
};

const ensureOrganisasjonsnavn = (arbeidsgiver: Arbeidsgiver): Arbeidsgiver => {
    return {
        ...arbeidsgiver,
        navn: arbeidsgiver.navn || arbeidsgiver.organisasjonsnummer,
    };
};

export async function getArbeidsgivere(
    fromDate: Date,
    toDate: Date,
    formikProps: FormikProps<SøknadFormData>,
    søkerdata: Søkerdata
) {
    if (isFeatureEnabled(Feature.DEMO_MODE)) {
        søkerdata.setArbeidsgivere(arbeidsgivereMock.organisasjoner);
        updateArbeidsforholdFormField(formikProps, arbeidsgivereMock.organisasjoner);
    } else {
        try {
            const response = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
            const organisasjoner = response.data ? response.data.organisasjoner.map(ensureOrganisasjonsnavn) : [];
            søkerdata.setArbeidsgivere(organisasjoner);
            updateArbeidsforholdFormField(formikProps, organisasjoner);
        } catch (error) {
            if (apiUtils.isUnauthorized(error)) {
                relocateToLoginPage();
            } else {
                appSentryLogger.logApiError(error);
            }
        }
    }
}
