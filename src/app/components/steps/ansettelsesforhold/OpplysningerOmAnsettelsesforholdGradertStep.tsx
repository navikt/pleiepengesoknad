import React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { navigateTo } from '../../../utils/navigationUtils';
import { Field } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import CheckboxPanelGroup from '../../checkbox-panel-group/CheckboxPanelGroup';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';
import { getNextStepRoute } from '../../../utils/routeUtils';
import AlertStripe from 'nav-frontend-alertstriper';
import Box from '../../box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import { InjectedIntlProps, FormattedMessage, injectIntl } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';
import GradertAnsettelsesforhold from '../../gradert-ansettelsesforhold/GradertAnsettelsesforhold';

interface OpplysningerOmAnsettelsesforholdStepProps {
    handleSubmit: () => void;
}

type Props = OpplysningerOmAnsettelsesforholdStepProps & HistoryProps & InjectedIntlProps;
const nextStepRoute = getNextStepRoute(StepID.ANSETTELSESFORHOLD);

const OpplysningerOmAnsettelsesforholdStep = ({ history, intl, ...stepProps }: Props) => {
    const navigate = () => navigateTo(nextStepRoute!, history);

    return (
        <FormikStep id={StepID.ANSETTELSESFORHOLD} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    søkerdata.ansettelsesforhold && søkerdata.ansettelsesforhold.length > 0 ? (
                        <>
                            <CheckboxPanelGroup
                                legend={intlHelper(intl, 'steg.ansettelsesforhold.hvilket.spm')}
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
            <Box margin="l">
                <AlertStripe type="info">
                    <FormattedMessage id="steg.ansettelsesforhold.manglesOpplysninger" />
                </AlertStripe>
            </Box>
        </FormikStep>
    );
};

export default injectIntl(OpplysningerOmAnsettelsesforholdStep);
