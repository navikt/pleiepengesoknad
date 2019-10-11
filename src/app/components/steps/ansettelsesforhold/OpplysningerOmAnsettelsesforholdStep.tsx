import * as React from 'react';
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
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const OpplysningerOmAnsettelsesforholdStep = ({
    history,
    intl,
    nextStepRoute,
    formValues: values,
    ...stepProps
}: Props) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    return (
        <FormikStep
            id={StepID.ANSETTELSESFORHOLD}
            onValidFormSubmit={navigate}
            history={history}
            formValues={values}
            {...stepProps}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    søkerdata.ansettelsesforhold && søkerdata.ansettelsesforhold.length > 0 ? (
                        <CheckboxPanelGroup
                            legend={intlHelper(intl, 'steg.ansettelsesforhold.væreBorteFra.spm')}
                            name={Field.ansettelsesforhold}
                            checkboxes={søkerdata.ansettelsesforhold!.map((a) => ({
                                label: a.navn,
                                value: a,
                                key: a.organisasjonsnummer
                            }))}
                        />
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
