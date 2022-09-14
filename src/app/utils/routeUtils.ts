import RouteConfig from '../config/routeConfig';
import { getSøknadStepsConfig, StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormValues } from '../types/SøknadFormValues';
import { isStepAvailable } from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getAvailableSteps = (values: SøknadFormValues): StepID[] => {
    const søknadStepsConfig = getSøknadStepsConfig(values);
    const steps: StepID[] = [];

    Object.keys(søknadStepsConfig).forEach((key) => {
        const stepID = søknadStepsConfig[key].id as StepID;
        const isAvailable = isStepAvailable(values, stepID);
        if (isAvailable) {
            steps.push(stepID);
        }
    });
    return steps;
};
