import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { validateAdresse, validateNavn } from '../../../utils/validationHelper';
import Input from '../../input/Input';
import { Field } from '../../../types/PleiepengesøknadFormData';
import FormikStep from '../../formik-step/FormikStep';

interface OpplysningerOmArbeidsforholdStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

type Props = OpplysningerOmArbeidsforholdStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.ARBEIDSFORHOLD);

class OpplysningerOmArbeidsforholdStep extends React.Component<Props> {
    render() {
        return (
            <FormikStep
                id={StepID.ARBEIDSFORHOLD}
                {...this.props}
                onValidFormSubmit={() => navigateTo(nextStepRoute!, this.props.history)}>
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
    }
}

export default OpplysningerOmArbeidsforholdStep;
