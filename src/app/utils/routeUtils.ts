import { stepConfig, StepID } from '../config/stepConfig';
import routeConfig from '../config/routeConfig';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { appIsRunningInDevEnvironment } from './envUtils';
import {
    legeerklæringStepAvailable,
    medlemskapStepAvailable,
    opplysningerOmAnsettelsesforholdStepAvailable,
    opplysningerOmBarnetStepAvailable,
    opplysningerOmTidsromStepAvailable,
    summaryStepAvailable
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${routeConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID): string | undefined => getSøknadRoute(stepConfig[stepId].nextStep);

export const stepRouteIsAvailable = (stepId: StepID, values: PleiepengesøknadFormData) => {
    if (!appIsRunningInDevEnvironment()) {
        switch (stepId) {
            case StepID.OPPLYSNINGER_OM_BARNET:
                return opplysningerOmBarnetStepAvailable(values);
            case StepID.TIDSROM:
                return opplysningerOmTidsromStepAvailable(values);
            case StepID.ANSETTELSESFORHOLD:
                return opplysningerOmAnsettelsesforholdStepAvailable(values);
            case StepID.LEGEERKLÆRING:
                return legeerklæringStepAvailable(values);
            case StepID.MEDLEMSKAP:
                return medlemskapStepAvailable(values);
            case StepID.SUMMARY:
                return summaryStepAvailable(values);
        }
    }
    return true;
};
