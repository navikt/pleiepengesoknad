import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { validateAdresse, validateNavn } from '../../../utils/validationHelper';
import Input from '../../input/Input';
import { PleiepengesøknadField } from '../../../types/PleiepengesøknadFormData';

interface OpplysningerOmArbeidsforholdStep {
    isValid: boolean;
    onSubmit: () => Promise<void>;
}

type Props = OpplysningerOmArbeidsforholdStep & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.ARBEIDSFORHOLD);
const OpplysningerOmArbeidsforholdStep: React.FunctionComponent<Props> = ({ isValid, onSubmit, history }) => {
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await onSubmit();
        if (isValid) {
            navigateTo(nextStepRoute!, history);
        }
    }

    return (
        <Step id={StepID.ARBEIDSFORHOLD} onSubmit={handleSubmit}>
            <Input
                label="Hva er navnet på arbeidsgiveren din?"
                name={PleiepengesøknadField.ArbeidsgiversNavn}
                validate={validateNavn}
            />
            <Input
                label="Hva er adressen til arbeidsgiveren din?"
                name={PleiepengesøknadField.ArbeidsgiversAdresse}
                validate={validateAdresse}
            />
        </Step>
    );
};

export default OpplysningerOmArbeidsforholdStep;
