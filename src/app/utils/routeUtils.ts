import { StepID, getStepConfig } from '../config/stepConfig';
import RouteConfig from '../config/routeConfig';
import { Field, PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { appIsRunningInDevEnvironment, appIsRunningInDemoMode } from './envUtils';
import {
    legeerklæringStepAvailable,
    medlemskapStepAvailable,
    opplysningerOmAnsettelsesforholdStepAvailable,
    opplysningerOmBarnetStepAvailable,
    opplysningerOmTidsromStepAvailable,
    summaryStepAvailable,
    tilsynsordningStepAvailable,
    nattevåkStepAvailable,
    beredskapStepAvailable
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID, formData?: PleiepengesøknadFormData): string | undefined => {
    const stepConfig = getStepConfig(formData);
    return stepConfig[stepId] ? getSøknadRoute(stepConfig[stepId].nextStep) : undefined;
};

export const isAvailable = (path: StepID | RouteConfig, values: PleiepengesøknadFormData) => {
    if (!appIsRunningInDevEnvironment() && !appIsRunningInDemoMode()) {
        switch (path) {
            case StepID.OPPLYSNINGER_OM_BARNET:
                return opplysningerOmBarnetStepAvailable(values);
            case StepID.TIDSROM:
                return opplysningerOmTidsromStepAvailable(values);
            case StepID.ANSETTELSESFORHOLD:
                return opplysningerOmAnsettelsesforholdStepAvailable(values);
            case StepID.OMSORGSTILBUD:
                return tilsynsordningStepAvailable(values);
            case StepID.NATTEVÅK:
                return nattevåkStepAvailable(values);
            case StepID.BEREDSKAP:
                return beredskapStepAvailable(values);
            case StepID.LEGEERKLÆRING:
                return legeerklæringStepAvailable(values);
            case StepID.MEDLEMSKAP:
                return medlemskapStepAvailable(values);
            case StepID.SUMMARY:
                return summaryStepAvailable(values);
            case RouteConfig.SØKNAD_SENDT_ROUTE:
                return values[Field.harBekreftetOpplysninger];
        }
    }
    return true;
};
