import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field } from 'formik';
import { PleiepengerFormdata } from '../../pleiepengesøknad/Pleiepengesøknad';
import { navigateTo } from '../../../utils/navigationHelper';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';

export interface MedlemsskapStepProps {
    values: PleiepengerFormdata;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

type Props = MedlemsskapStepProps & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.MEDLEMSSKAP);
const MedlemsskapStep: React.FunctionComponent<Props> = ({ onSubmit, history }) => (
    <Step
        id={StepID.MEDLEMSSKAP}
        onSubmit={(e) => {
            onSubmit(e);
            navigateTo(nextStepRoute!, history);
        }}>
        <Field type="text" name="someField2" placeholder="Some value 2" />
    </Step>
);

export default MedlemsskapStep;
