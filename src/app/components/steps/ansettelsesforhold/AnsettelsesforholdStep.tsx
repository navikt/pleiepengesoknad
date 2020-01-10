import React, { useEffect, useState } from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { InjectedIntlProps, FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import FormikAnsettelsesforhold from '../../formik-ansettelsesforhold/FormikAnsettelsesforhold';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';
import { getArbeidsgiver } from 'app/api/api';
import { Søkerdata, Ansettelsesforhold } from 'app/types/Søkerdata';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { CustomFormikProps } from 'app/types/FormikProps';
import { AppFormField } from 'app/types/PleiepengesøknadFormData';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { apiUtils } from 'app/utils/apiUtils';
import { appIsRunningInDemoMode } from 'app/utils/envUtils';
import demoSøkerdata from 'app/demo/demoData';
import { syncAnsettelsesforholdInFormDataWithSøkerdata } from 'app/utils/ansettelsesforholdUtils';

interface AnsettelsesforholdStepProps {
    formikProps: CustomFormikProps;
    søkerdata: Søkerdata;
}

type Props = CommonStepFormikProps & AnsettelsesforholdStepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const updateAnsettelsforholdForm = (formikProps: CustomFormikProps, organisasjoner: Ansettelsesforhold[]) => {
    const updatedAnsettelsesforhold = syncAnsettelsesforholdInFormDataWithSøkerdata(
        organisasjoner,
        formikProps.values[AppFormField.ansettelsesforhold]
    );
    if (updatedAnsettelsesforhold.length > 0) {
        formikProps.setFieldValue(AppFormField.ansettelsesforhold, updatedAnsettelsesforhold);
    }
};

async function getAnsettelsesforhold(
    fromDate: Date,
    toDate: Date,
    formikProps: CustomFormikProps,
    søkerdata: Søkerdata
) {
    if (appIsRunningInDemoMode()) {
        søkerdata.setAnsettelsesforhold(demoSøkerdata.ansettelsesforhold);
        updateAnsettelsforholdForm(formikProps, demoSøkerdata.ansettelsesforhold);
        return;
    }
    try {
        const response = await getArbeidsgiver(formatDateToApiFormat(fromDate), formatDateToApiFormat(toDate));
        const { organisasjoner } = response.data;
        søkerdata.setAnsettelsesforhold!(organisasjoner);
        updateAnsettelsforholdForm(formikProps, organisasjoner);
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        }
    }
}

const AnsettelsesforholdStep = ({ history, intl, søkerdata, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const [isLoading, setIsLoading] = useState(false);
    const { ansettelsesforhold } = formikProps.values;

    useEffect(() => {
        const fraDato = formikProps.values[AppFormField.periodeFra];
        const tilDato = formikProps.values[AppFormField.periodeFra];

        const fetchData = async () => {
            if (fraDato && tilDato) {
                await getAnsettelsesforhold(fraDato, tilDato, formikProps, søkerdata);
                setIsLoading(false);
            }
        };
        if (fraDato && tilDato) {
            setIsLoading(true);
            fetchData();
        }
    }, []);

    return (
        <FormikStep
            id={StepID.ANSETTELSESFORHOLD}
            onValidFormSubmit={navigate}
            history={history}
            {...stepProps}
            buttonDisabled={isLoading}>
            {isLoading && <LoadingSpinner type="XS" style={'block'} blockTitle="Henter arbeidsforhold" />}
            {!isLoading && (
                <>
                    <Box padBottom="xl">
                        <CounsellorPanel>
                            <FormattedHTMLMessage id="steg.ansettelsesforhold.aktivtArbeidsforhold.info.html" />
                        </CounsellorPanel>
                    </Box>
                    {ansettelsesforhold.length > 0 && (
                        <>
                            {ansettelsesforhold.map((forhold, index) => (
                                <Box padBottom="l" key={forhold.organisasjonsnummer}>
                                    <FormSection title={forhold.navn}>
                                        <FormikAnsettelsesforhold ansettelsesforhold={forhold} index={index} />
                                    </FormSection>
                                </Box>
                            ))}
                        </>
                    )}
                    {ansettelsesforhold.length === 0 && (
                        <Normaltekst>
                            <FormattedMessage id="steg.ansettelsesforhold.ingenOpplysninger" />
                        </Normaltekst>
                    )}
                    <Box margin="m" padBottom="m">
                        <AlertStripe type="info">
                            <FormattedMessage id="steg.ansettelsesforhold.gradert.manglesOpplysninger" />
                        </AlertStripe>
                    </Box>
                </>
            )}
        </FormikStep>
    );
};

export default injectIntl(AnsettelsesforholdStep);
