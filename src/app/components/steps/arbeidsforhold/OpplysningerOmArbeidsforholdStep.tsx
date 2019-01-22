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

const OpplysningerOmArbeidsforholdStep = ({ history, ...stepProps }: Props) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.ARBEIDSFORHOLD} onValidFormSubmit={navigate} {...stepProps}>
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
