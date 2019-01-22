import * as React from 'react';
import Page from '../page/Page';
import { stepConfig, StepID } from '../../config/stepConfig';
import bemHelper from '../../utils/bemHelper';
import StepIndicator from '../step-indicator/StepIndicator';
import { Hovedknapp as Button } from 'nav-frontend-knapper';
import './step.less';
import Box from '../box/Box';

const bem = bemHelper('step');

export interface StepProps {
    id: StepID;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
}

const Step: React.FunctionComponent<StepProps> = ({
    id,
    handleSubmit,
    showSubmitButton,
    showButtonSpinner,
    children
}) => {
    const conf = stepConfig[id];
    return (
        <Page className={bem.className} title={conf.title}>
            <StepIndicator stepConfig={stepConfig} activeStep={conf.index} />
            <Box margin="xl">
                <form onSubmit={handleSubmit}>
                    {children}
                    {showSubmitButton !== false && (
                        <Button className={bem.element('button')} spinner={showButtonSpinner || false}>
                            {conf.buttonLabel}
                        </Button>
                    )}
                </form>
            </Box>
        </Page>
    );
};

export default Step;
