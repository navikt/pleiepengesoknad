import { stepConfig, StepID } from '../config/stepConfig';
import { getSøknadRoute } from './routeConfigHelper';

export const getNextStepRoute = (stepId: StepID): string | undefined => getSøknadRoute(stepConfig[stepId].nextStep);
