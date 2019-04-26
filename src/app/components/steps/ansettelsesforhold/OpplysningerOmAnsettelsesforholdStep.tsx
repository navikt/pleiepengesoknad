import * as React from 'react';
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

interface OpplysningerOmAnsettelsesforholdStepProps {
    handleSubmit: () => void;
}

type Props = OpplysningerOmAnsettelsesforholdStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.ANSETTELSESFORHOLD);

const OpplysningerOmAnsettelsesforholdStep = ({ history, ...stepProps }: Props) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.ANSETTELSESFORHOLD} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    søkerdata.ansettelsesforhold && søkerdata.ansettelsesforhold.length > 0 ? (
                        <CheckboxPanelGroup
                            legend="Hvilken jobb må du være borte fra for å pleie barnet?"
                            name={Field.ansettelsesforhold}
                            checkboxes={søkerdata.ansettelsesforhold!.map((a) => ({
                                label: a.navn,
                                value: a,
                                key: a.organisasjonsnummer
                            }))}
                        />
                    ) : (
                        <Normaltekst>Du er ikke registrert med noen arbeidsforhold.</Normaltekst>
                    )
                }
            </SøkerdataContextConsumer>
            <Box margin="l">
                <AlertStripe type="info">
                    Mangler det en arbeidsgiver her? Be arbeidsgiveren din sende ny A-melding, enten via lønns- og
                    personalsystemet eller gjennom Altinn
                </AlertStripe>
            </Box>
        </FormikStep>
    );
};

export default OpplysningerOmAnsettelsesforholdStep;
