import { stepConfig, StepID } from '../config/stepConfig';
import { getSøknadRoute } from './routeHelper';

export const getNextStepRoute = (stepId: StepID): string | undefined => getSøknadRoute(stepConfig[stepId].nextStep);
