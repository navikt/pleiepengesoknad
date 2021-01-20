import * as React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import NAVStepIndicator from 'nav-frontend-stegindikator/lib/stegindikator';
import { default as Step } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { StepConfigInterface, StepID } from '../../config/stepConfig';
import { getStepTexts } from '../../utils/stepUtils';

interface Props {
    activeStep: number;
    stepConfig: StepConfigInterface;
}

const renderSteps = (stepConfig: StepConfigInterface, intl: IntlShape) =>
    Object.keys(stepConfig).map((stepId) => {
        const { stepIndicatorLabel } = getStepTexts(intl, stepId as StepID, stepConfig);
        const { index } = stepConfig[stepId];
        return <Step label={stepIndicatorLabel} index={index} key={`${stepIndicatorLabel + index}`} />;
    });

const StepIndicator = ({ activeStep, stepConfig }: Props) => {
    const intl = useIntl();
    return (
        <NAVStepIndicator visLabel={true} autoResponsiv={true} aktivtSteg={activeStep}>
            {renderSteps(stepConfig, intl)}
        </NAVStepIndicator>
    );
};

export default StepIndicator;
