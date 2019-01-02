import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';

export interface SummaryStepProps {
    isValid: boolean;
    values: PleiepengesøknadFormData;
    onSubmit: () => Promise<void>;
}

type Props = SummaryStepProps & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.SUMMARY);
const SummaryStep: React.FunctionComponent<Props> = ({ isValid, onSubmit, history, values }) => {
    return (
        <Step
            id={StepID.SUMMARY}
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit().then(() => {
                    if (isValid) {
                        navigateTo(nextStepRoute!, history);
                    }
                });
            }}>
            <h2>Oppsummering</h2>
            {JSON.stringify(values)}
        </Step>
    );
};

export default SummaryStep;
