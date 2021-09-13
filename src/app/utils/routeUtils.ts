import RouteConfig from '../config/routeConfig';
import { getStepConfig, StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import {
    arbeidsforholdStepAvailable,
    beredskapStepAvailable,
    legeerklæringStepAvailable,
    medlemskapStepAvailable,
    nattevåkStepAvailable,
    opplysningerOmBarnetStepAvailable,
    opplysningerOmTidsromStepAvailable,
    summaryStepAvailable,
    omsorgstilbudStepAvailable,
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID, formData?: PleiepengesøknadFormData): string | undefined => {
    const stepConfig = getStepConfig(formData);
    return stepConfig[stepId] && stepConfig[stepId].included === true
        ? getSøknadRoute(stepConfig[stepId].nextStep)
        : undefined;
};

export const isAvailable = (
    path: StepID | RouteConfig,
    values: PleiepengesøknadFormData,
    søknadHasBeenSent?: boolean
) => {
    switch (path) {
        case StepID.OPPLYSNINGER_OM_BARNET:
            return opplysningerOmBarnetStepAvailable(values);
        case StepID.TIDSROM:
            return opplysningerOmTidsromStepAvailable(values);
        case StepID.ARBEIDSFORHOLD:
            return arbeidsforholdStepAvailable(values);
        case StepID.ARBEIDSFORHOLD_I_PERIODEN:
            return true; //arbeidsforholdStepAvailable(values);
        case StepID.OMSORGSTILBUD:
            return omsorgstilbudStepAvailable(values);
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
            return søknadHasBeenSent === true;
    }
    return false;
};
