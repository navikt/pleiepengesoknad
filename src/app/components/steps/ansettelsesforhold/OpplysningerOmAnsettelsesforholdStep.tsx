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

interface OpplysningerOmAnsettelsesforholdStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

type Props = OpplysningerOmAnsettelsesforholdStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.ANSETTELSESFORHOLD);

const OpplysningerOmAnsettelsesforholdStep = ({ history, ...stepProps }: Props) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.ANSETTELSESFORHOLD} onValidFormSubmit={navigate} {...stepProps}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    søkerdata.ansettelsesforhold && (
                        <CheckboxPanelGroup
                            legend="Fra hvilke(t) arbeidsforhold har du fravær for å ha tilsyn med barnet?"
                            name={Field.ansettelsesforhold}
                            checkboxes={søkerdata.ansettelsesforhold!.map((a) => ({
                                label: a.navn,
                                value: a,
                                key: a.organisasjonsnummer
                            }))}
                        />
                    )
                }
            </SøkerdataContextConsumer>
        </FormikStep>
    );
};

export default OpplysningerOmAnsettelsesforholdStep;
