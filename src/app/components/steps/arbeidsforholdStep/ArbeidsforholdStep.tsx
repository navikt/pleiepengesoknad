import React, { useContext, useEffect, useState } from 'react';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import BuildingIcon from 'common/components/building-icon/BuildingIconSvg';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';
import LoadingSpinner from 'common/components/loading-spinner/LoadingSpinner';
import { AppFormField, PleiepengesøknadFormData } from 'app/types/PleiepengesøknadFormData';
import { getArbeidsgivere } from 'app/utils/arbeidsforholdUtils';
import { Feature, isFeatureEnabled } from 'app/utils/featureToggleUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøkerdataContext } from '../../../context/SøkerdataContext';
import FormikArbeidsforhold from '../../formik-arbeidsforhold/FormikArbeidsforhold';
import FormikStep from '../../formik-step/FormikStep';
import FrilansFormPart from './FrilansFormPart';
import SelvstendigNæringsdrivendeFormPart from './SelvstendigNæringsdrivendePart';

const ArbeidsforholdStep = ({ onValidSubmit }: StepConfigProps) => {
    const formikProps = useFormikContext<PleiepengesøknadFormData>();
    const {
        values,
        values: { arbeidsforhold }
    } = formikProps;
    const [isLoading, setIsLoading] = useState(false);
    const søkerdata = useContext(SøkerdataContext);

    useEffect(() => {
        const fraDato = values[AppFormField.periodeFra];
        const tilDato = values[AppFormField.periodeFra];

        const fetchData = async () => {
            if (søkerdata) {
                if (fraDato && tilDato) {
                    await getArbeidsgivere(fraDato, tilDato, formikProps, søkerdata);
                    setIsLoading(false);
                }
            }
        };
        if (fraDato && tilDato) {
            setIsLoading(true);
            fetchData();
        }
    }, []);

    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD} onValidFormSubmit={onValidSubmit} buttonDisabled={isLoading}>
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

                    {isFeatureEnabled(Feature.TOGGLE_SELVSTENDIG) && (
                        <Box margin="l" padBottom="l">
                            <SelvstendigNæringsdrivendeFormPart formValues={values} />
                        </Box>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default ArbeidsforholdStep;
