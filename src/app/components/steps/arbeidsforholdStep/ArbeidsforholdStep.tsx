import React, { useEffect, useState } from 'react';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';
import { Søkerdata } from 'app/types/Søkerdata';
import { PleiepengesøknadFormikProps } from 'app/types/PleiepengesøknadFormikProps';
import { AppFormField } from 'app/types/PleiepengesøknadFormData';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { getArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import FrilansFormPart from './FrilansFormPart';
import { persistAndNavigateTo } from 'app/utils/navigationUtils';
import { isFeatureEnabled, Feature } from 'app/utils/featureToggleUtils';

interface OwnProps {
    formikProps: PleiepengesøknadFormikProps;
    søkerdata: Søkerdata;
}

type Props = CommonStepFormikProps & OwnProps & HistoryProps & StepConfigProps;

const ArbeidsforholdStep = ({ history, søkerdata, nextStepRoute, formikProps, ...stepProps }: Props) => {
    const {
        values,
        values: { arbeidsforhold }
    } = formikProps;
    const [isLoading, setIsLoading] = useState(false);

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
            onValidFormSubmit={() => persistAndNavigateTo(history, StepID.ARBEIDSFORHOLD, values, nextStepRoute)}
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

                    {arbeidsforhold.length === 0 && <FormattedMessage id="steg.arbeidsforhold.ingenOpplysninger" />}

                    <Box margin="s" padBottom="xl">
                        <AlertStripe type="info">
                            <FormattedMessage id="steg.arbeidsforhold.manglesOpplysninger" />
                        </AlertStripe>
                    </Box>

                    {isFeatureEnabled(Feature.TOGGLE_FRILANS) && (
                        <Box margin="l" padBottom="l">
                            <FrilansFormPart formValues={values} />
                        </Box>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdStep;
