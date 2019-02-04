import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { Field } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';
import CheckboxPanelGroup from '../../checkbox-panel-group/CheckboxPanelGroup';
import { SøkerdataContextConsumer } from '../../../context/SøkerdataContext';
import { Søkerdata } from '../../../types/Søkerdata';

interface OpplysningerOmArbeidsforholdStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

type Props = OpplysningerOmArbeidsforholdStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.ARBEIDSFORHOLD);

const OpplysningerOmArbeidsforholdStep = ({ history, ...stepProps }: Props) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD} onValidFormSubmit={navigate} {...stepProps}>
            <SøkerdataContextConsumer>
                {(søkerdata: Søkerdata) =>
                    søkerdata.ansettelsesforhold && (
                        <CheckboxPanelGroup
                            legend="Fra hvilke(t) arbeidsforhold har du fravær for å ha tilsyn med barnet?"
                            name={Field.ansettelsesforhold}
                            checkboxes={søkerdata.ansettelsesforhold!.map((a) => ({
                                label: a.navn,
                                value: a.organisasjonsnummer,
                                key: a.organisasjonsnummer
                            }))}
                        />
                    )
                }
            </SøkerdataContextConsumer>
        </FormikStep>
    );
};

export default OpplysningerOmArbeidsforholdStep;
