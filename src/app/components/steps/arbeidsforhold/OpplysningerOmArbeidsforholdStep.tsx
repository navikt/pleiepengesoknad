import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import Input from '../../input/Input';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateAdresse, validateNavn } from '../../../utils/validationHelper';

interface OpplysningerOmArbeidsforholdStep {
    isValid: boolean;
    values: PleiepengesøknadFormData;
    onSubmit: () => Promise<void>;
}

type Props = OpplysningerOmArbeidsforholdStep & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.ARBEIDSFORHOLD);
const OpplysningerOmArbeidsforholdStep: React.FunctionComponent<Props> = ({ isValid, onSubmit, history }) => {
    return (
        <Step
            id={StepID.ARBEIDSFORHOLD}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit().then(() => {
                    if (isValid) {
                        navigateTo(nextStepRoute!, history);
                    }
                });
            }}>
            <Input label="Hva er navnet på arbeidsgiveren din?" name="arbeidsgiversNavn" validate={validateNavn} />
            <Input
                label="Hva er adressen til arbeidsgiveren din?"
                name="arbeidsgiversAdresse"
                validate={validateAdresse}
            />
        </Step>
    );
};

export default OpplysningerOmArbeidsforholdStep;
