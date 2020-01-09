import React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import { navigateTo } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from 'common/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { InjectedIntlProps, FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import Ansettelsesforhold from '../../formik-ansettelsesforhold/FormikAnsettelsesforhold';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormSection from 'common/components/form-section/FormSection';

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const AnsettelsesforholdStep = ({ history, intl, nextStepRoute, ...stepProps }: Props) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { ansettelsesforhold } = stepProps.formValues;

    return (
        <FormikStep id={StepID.ANSETTELSESFORHOLD} onValidFormSubmit={navigate} history={history} {...stepProps}>
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
                                <Ansettelsesforhold ansettelsesforhold={forhold} index={index} />
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
        </FormikStep>
    );
};

export default injectIntl(AnsettelsesforholdStep);
