import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { validateAdresse, validateNavn } from '../../../utils/validationHelper';
import Input from '../../input/Input';
import { Field } from '../../../types/PleiepengesøknadFormData';

interface OpplysningerOmArbeidsforholdStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

type Props = OpplysningerOmArbeidsforholdStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.ARBEIDSFORHOLD);

class OpplysningerOmArbeidsforholdStep extends React.Component<Props> {
    componentDidUpdate(previousProps: Props) {
        if (previousProps.isSubmitting === true && this.props.isSubmitting === false && this.props.isValid === true) {
            const { history } = this.props;
            navigateTo(nextStepRoute!, history);
        }
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <Step id={StepID.ARBEIDSFORHOLD} onSubmit={handleSubmit}>
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
            </Step>
        );
    }
}

export default OpplysningerOmArbeidsforholdStep;
