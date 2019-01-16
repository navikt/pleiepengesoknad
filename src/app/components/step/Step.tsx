import * as React from 'react';
import Page from '../page/Page';
import { stepConfig, StepID } from '../../config/stepConfig';
import bemHelper from '../../utils/bemHelper';
import StepIndicator from '../step-indicator/StepIndicator';
import { Hovedknapp as Button } from 'nav-frontend-knapper';
import './step.less';
import Box from '../box/Box';

const bem = bemHelper('step');

interface StepPropsInterface {
    id: StepID;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    showSubmitButton?: boolean;
    showButtonSpinner?: boolean;
}

const Step: React.FunctionComponent<StepPropsInterface> = ({
    id,
    onSubmit,
    showSubmitButton,
    showButtonSpinner,
    children
}) => {
    const conf = stepConfig[id];
    return (
        <Page className={bem.className} title={conf.title}>
            <StepIndicator stepConfig={stepConfig} activeStep={conf.index} />
            <Box margin="xl">
                <form onSubmit={onSubmit}>
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
