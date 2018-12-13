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
        const { title, index } = stepConfig[stepId];
        return <Step label={title} index={index} key={`${title + index}`} />;
    });

const StepIndicator: React.FunctionComponent<StepIndicatorProps> = ({ activeStep, stepConfig }) => (
    <NAVStepIndicator visLabel={false} kompakt={true} autoResponsiv={true} aktivtSteg={activeStep}>
        {renderSteps(stepConfig)}
    </NAVStepIndicator>
);

export default StepIndicator;
