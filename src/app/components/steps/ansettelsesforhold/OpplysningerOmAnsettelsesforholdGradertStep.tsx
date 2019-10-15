import React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { navigateTo } from '../../../utils/navigationUtils';
import { Field } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import CheckboxPanelGroup from '../../checkbox-panel-group/CheckboxPanelGroup';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from '../../box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { InjectedIntlProps, FormattedMessage, injectIntl } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';
import GradertAnsettelsesforhold from '../../gradert-ansettelsesforhold/GradertAnsettelsesforhold';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import { isFeatureEnabled, Feature } from '../../../utils/featureToggleUtils';
import CounsellorPanel from '../../counsellor-panel/CounsellorPanel';

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const OpplysningerOmAnsettelsesforholdStep = ({ history, intl, nextStepRoute, ...stepProps }: Props) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;

    return (
        <FormikStep id={StepID.ANSETTELSESFORHOLD} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    søkerdata.ansettelsesforhold && søkerdata.ansettelsesforhold.length > 0 ? (
                        <>
                            <Box padBottom="xl">
                                <CounsellorPanel>
                                    <FormattedMessage id="steg.ansettelsesforhold.aktivtArbeidsforhold.info" />
                                </CounsellorPanel>
                            </Box>
                            <CheckboxPanelGroup
                                legend={intlHelper(intl, 'steg.ansettelsesforhold.aktivtArbeidsforhold.spm')}
                                name={Field.ansettelsesforhold}
                                valueKey="organisasjonsnummer"
                                singleColumn={true}
                                checkboxes={søkerdata.ansettelsesforhold!.map((a) => ({
                                    label: a.navn,
                                    value: a,
                                    key: a.organisasjonsnummer,
                                    expandedContentRenderer: () => (
                                        <GradertAnsettelsesforhold organisasjonsnummer={a.organisasjonsnummer} />
                                    )
                                }))}
                            />
                        </>
                    ) : (
                        <Normaltekst>
                            <FormattedMessage id="steg.ansettelsesforhold.ingenOpplysninger" />
                        </Normaltekst>
                    )
                }
            </SøkerdataContextConsumer>
            <Box margin="xl" padBottom="m">
                <AlertStripe type="info">
                    {isFeatureEnabled(Feature.TOGGLE_TILSYN) && (
                        <FormattedMessage id="steg.ansettelsesforhold.gradert.manglesOpplysninger" />
                    )}
                    {!isFeatureEnabled(Feature.TOGGLE_TILSYN) && (
                        <FormattedMessage id="steg.ansettelsesforhold.manglesOpplysninger" />
                    )}
                </AlertStripe>
            </Box>
        </FormikStep>
    );
};

export default injectIntl(OpplysningerOmAnsettelsesforholdStep);
