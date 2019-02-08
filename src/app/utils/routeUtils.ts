import { stepConfig, StepID } from '../config/stepConfig';
import routeConfig from '../config/routeConfig';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${routeConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID): string | undefined => getSøknadRoute(stepConfig[stepId].nextStep);
