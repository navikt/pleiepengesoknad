import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { PleiepengerFormdata } from '../../pleiepengesøknad/Pleiepengesøknad';
import { navigateTo } from '../../../utils/navigationHelper';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';

export interface SummaryStepProps {
    values: PleiepengerFormdata;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

type Props = SummaryStepProps & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.SUMMARY);
const SummaryStep: React.FunctionComponent<Props> = ({ values, onSubmit, history }) => (
    <Step
        id={StepID.SUMMARY}
        onSubmit={(e) => {
            onSubmit(e);
            navigateTo(nextStepRoute!, history);
        }}>
        Summary
    </Step>
);

export default SummaryStep;
