import * as React from 'react';
import Page from '../page/Page';
import { stepConfig, StepID } from '../../config/stepConfig';
import bemHelper from '../../utils/bemHelper';
import StepIndicator from '../step-indicator/StepIndicator';

const bem = bemHelper('step');

interface StepPropsInterface {
    id: StepID;
}

const Step: React.FunctionComponent<StepPropsInterface> = ({ id, children }) => (
    <Page className={bem.className} title={stepConfig[id].title}>
        <StepIndicator stepConfig={stepConfig} activeStep={stepConfig[id].index} />
        {children}
    </Page>
);

export default Step;
