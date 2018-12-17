import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { HistoryProps } from '../../../types/History';

export interface RelasjonTilBarnStepProps {}

type Props = RelasjonTilBarnStepProps & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.MEDLEMSSKAP);
const MedlemsskapStep: React.FunctionComponent<Props> = ({ history }) => (
    <Step
        id={StepID.MEDLEMSSKAP}
        onButtonClick={() => {
            navigateTo(nextStepRoute!, history);
        }}>
        Medlemsskap-steg
    </Step>
);
export default MedlemsskapStep;
