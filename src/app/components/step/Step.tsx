import * as React from 'react';
import Page from '../page/Page';
import { stepConfig, StepID } from '../../config/stepConfig';
import bemHelper from '../../utils/bemHelper';
import StepIndicator from '../step-indicator/StepIndicator';
import { Hovedknapp as Button } from 'nav-frontend-knapper';
import './step.less';

const bem = bemHelper('step');

interface StepPropsInterface {
    id: StepID;
    onButtonClick?: () => void;
}

const Step: React.FunctionComponent<StepPropsInterface> = ({ id, onButtonClick, children }) => {
    const conf = stepConfig[id];
    return (
        <Page className={bem.className} title={conf.title}>
            <StepIndicator stepConfig={stepConfig} activeStep={conf.index} />
            {children}
            <Button className={bem.element('button')} onClick={onButtonClick}>
                {conf.buttonLabel}
            </Button>
        </Page>
    );
};

export default Step;
