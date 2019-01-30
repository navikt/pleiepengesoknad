import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { validateAdresse, validateNavn } from '../../../utils/validationHelper';
import Input from '../../input/Input';
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
                {(søkerdata: Søkerdata) => (
                    <CheckboxPanelGroup
                        legend="Velg arbeidsforhold"
                        name={Field.ansettelsesforhold}
                        checkboxes={søkerdata.ansettelsesforhold.map((a) => ({
                            label: a.navn,
                            value: a.organisasjonsnummer
                        }))}
                    />
                )}
            </SøkerdataContextConsumer>
            <Input
                label="Hva er navnet på arbeidsgiveren din?"
                name={Field.arbeidsgiversNavn}
                validate={validateNavn}
            />
            <Input
                label="Hva er adressen til arbeidsgiveren din?"
                name={Field.arbeidsgiversAdresse}
                validate={validateAdresse}
            />
        </FormikStep>
    );
};

export default OpplysningerOmArbeidsforholdStep;
