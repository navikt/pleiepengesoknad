import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';

const SummaryStep: React.FunctionComponent = () => <Step id={StepID.SUMMARY}>Oppsummeringssteg</Step>;
export default SummaryStep;
