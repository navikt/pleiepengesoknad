import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { HistoryProps } from '../../../types/History';
import { PleiepengerFormdata } from '../../pleiepengesøknad/Pleiepengesøknad';

export interface MedlemsskapStepProps {
    values: PleiepengerFormdata;
}

type Props = MedlemsskapStepProps & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.MEDLEMSSKAP);
const MedlemsskapStep: React.FunctionComponent<Props> = ({ values, history }) => {
    console.log('has values', values);
    return (
        <Step
            id={StepID.MEDLEMSSKAP}
            onButtonClick={() => {
                navigateTo(nextStepRoute!, history);
            }}>
            Medlemsskap-steg
        </Step>
    );
};
export default MedlemsskapStep;
