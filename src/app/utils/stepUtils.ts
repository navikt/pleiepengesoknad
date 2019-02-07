import { stepConfig, StepID } from '../config/stepConfig';
import { getSøknadRoute } from './routeUtils';

export const getNextStepRoute = (stepId: StepID): string | undefined => getSøknadRoute(stepConfig[stepId].nextStep);
