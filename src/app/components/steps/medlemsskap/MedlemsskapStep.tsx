import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field } from 'formik';
import { PleiepengerFormdata } from '../../pleiepengesøknad/Pleiepengesøknad';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';

export interface MedlemsskapStepProps {
    isValid: boolean;
    values: PleiepengerFormdata;
    onSubmit: () => Promise<void>;
}

type Props = MedlemsskapStepProps & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.MEDLEMSSKAP);
const MedlemsskapStep: React.FunctionComponent<Props> = ({ isValid, onSubmit, history }) => {
    return (
        <Step
            id={StepID.MEDLEMSSKAP}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit().then(() => {
                    if (isValid) {
                        navigateTo(nextStepRoute!, history);
                    }
                });
            }}>
            <Field
                type="text"
                name="someField2"
                placeholder="Some field 1"
                validate={(v: string) => {
                    let result;
                    if (v.length > 2) {
                        result = 'Invalid';
                    }
                    return result;
                }}
            />
        </Step>
    );
};

export default MedlemsskapStep;
