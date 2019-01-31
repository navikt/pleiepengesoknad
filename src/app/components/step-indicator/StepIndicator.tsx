import * as React from 'react';
import NAVStepIndicator from 'nav-frontend-stegindikator/lib/stegindikator';
import { default as Step } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { StepConfigInterface } from '../../config/stepConfig';

interface StepIndicatorProps {
    activeStep: number;
    stepConfig: StepConfigInterface;
}

const renderSteps = (stepConfig: StepConfigInterface) =>
    Object.keys(stepConfig).map((stepId) => {
        const { stepIndicatorLabel, index } = stepConfig[stepId];
        return <Step label={stepIndicatorLabel} index={index} key={`${stepIndicatorLabel + index}`} />;
    });

const StepIndicator: React.FunctionComponent<StepIndicatorProps> = ({ activeStep, stepConfig }) => (
    <NAVStepIndicator visLabel={true} autoResponsiv={true} aktivtSteg={activeStep}>
        {renderSteps(stepConfig)}
    </NAVStepIndicator>
);

export default StepIndicator;
