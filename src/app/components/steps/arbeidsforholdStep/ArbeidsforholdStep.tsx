import React, { useEffect, useState } from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import { navigateTo, navigateToLoginPage } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { InjectedIntlProps, FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';
import { getArbeidsgiver } from 'app/api/api';
import { Søkerdata, Arbeidsgiver } from 'app/types/Søkerdata';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { CustomFormikProps } from 'app/types/FormikProps';
import { AppFormField } from 'app/types/PleiepengesøknadFormData';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { apiUtils } from 'app/utils/apiUtils';
import { appIsRunningInDemoMode } from 'app/utils/envUtils';
import demoSøkerdata from 'app/demo/demoData';
import { syndArbeidsforholdWithArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';

interface OwnProps {
    formikProps: CustomFormikProps;
    søkerdata: Søkerdata;
}

type Props = CommonStepFormikProps & OwnProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const updateArbeidsforhold = (formikProps: CustomFormikProps, arbeidsgivere: Arbeidsgiver[]) => {
    const updatedArbeidsforhold = syndArbeidsforholdWithArbeidsgivere(
        arbeidsgivere,
        formikProps.values[AppFormField.arbeidsforhold]
    );
    if (updatedArbeidsforhold.length > 0) {
        formikProps.setFieldValue(AppFormField.arbeidsforhold, updatedArbeidsforhold);
    }
};

async function getArbeidsgivere(fromDate: Date, toDate: Date, formikProps: CustomFormikProps, søkerdata: Søkerdata) {
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

const ArbeidsforholdStep = ({ history, intl, søkerdata, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const [isLoading, setIsLoading] = useState(false);
    const { arbeidsforhold } = formikProps.values;

    useEffect(() => {
        const fraDato = formikProps.values[AppFormField.periodeFra];
        const tilDato = formikProps.values[AppFormField.periodeFra];

        const fetchData = async () => {
            if (fraDato && tilDato) {
                await getArbeidsgivere(fraDato, tilDato, formikProps, søkerdata);
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
            id={StepID.ARBEIDSFORHOLD}
            onValidFormSubmit={navigate}
            history={history}
            {...stepProps}
            buttonDisabled={isLoading}>
            {isLoading && <LoadingSpinner type="XS" style={'block'} blockTitle="Henter arbeidsforhold" />}
            {!isLoading && (
                <>
                    <Box padBottom="xxl">
                        <CounsellorPanel>
                            <FormattedHTMLMessage id="steg.arbeidsforhold.aktivtArbeidsforhold.info.html" />
                        </CounsellorPanel>
                    </Box>
                    {arbeidsforhold.length > 0 && (
                        <>
                            {arbeidsforhold.map((forhold, index) => (
                                <Box padBottom="l" key={forhold.organisasjonsnummer}>
                                    <FormSection titleTag="h4" title={forhold.navn} titleIcon={<BuildingIcon />}>
                                        <FormikArbeidsforhold arbeidsforhold={forhold} index={index} />
                                    </FormSection>
                                </Box>
                            ))}
                        </>
                    )}
                    {arbeidsforhold.length === 0 && (
                        <Normaltekst>
                            <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />
                        </Normaltekst>
                    )}
                    <Box margin="m" padBottom="m">
                        <AlertStripe type="info">
                            <FormattedMessage id="steg.arbeidsforhold.gradert.manglesOpplysninger" />
                        </AlertStripe>
                    </Box>
                </>
            )}
        </FormikStep>
    );
};

export default injectIntl(ArbeidsforholdStep);
