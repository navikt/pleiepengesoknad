import RouteConfig from '../config/routeConfig';
import { getSøknadStepConfig, StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import {
    arbeidssituasjonStepAvailable,
    legeerklæringStepAvailable,
    medlemskapStepAvailable,
    opplysningerOmBarnetStepAvailable,
    opplysningerOmTidsromStepAvailable,
    oppsummeringStepAvailable,
    omsorgstilbudStepAvailable,
    nattevåkOgBeredskapStepAvailable,
    arbeidIPeriodeStepIsAvailable,
} from './stepUtils';

export const getSøknadRoute = (stepId: StepID | undefined) => {
    if (stepId !== undefined) {
        return `${RouteConfig.SØKNAD_ROUTE_PREFIX}/${stepId}`;
    }
    return undefined;
};

export const getNextStepRoute = (stepId: StepID, formData?: SøknadFormData): string | undefined => {
    const stepConfig = getSøknadStepConfig(formData);
    return stepConfig[stepId] && stepConfig[stepId].included === true
        ? getSøknadRoute(stepConfig[stepId].nextStep)
        : undefined;
};

export const isAvailable = (path: StepID | RouteConfig, values: SøknadFormData, søknadHasBeenSent?: boolean) => {
    switch (path) {
        case StepID.OPPLYSNINGER_OM_BARNET:
            return opplysningerOmBarnetStepAvailable(values);
        case StepID.TIDSROM:
            return opplysningerOmTidsromStepAvailable(values);
        case StepID.ARBEIDSSITUASJON:
            return arbeidssituasjonStepAvailable(values);
        case StepID.ARBEIDSTID:
            return arbeidIPeriodeStepIsAvailable(values);
        case StepID.OMSORGSTILBUD:
            return omsorgstilbudStepAvailable(values);
        case StepID.NATTEVÅK_OG_BEREDSKAP:
            return nattevåkOgBeredskapStepAvailable;
        case StepID.LEGEERKLÆRING:
            return legeerklæringStepAvailable(values);
        case StepID.MEDLEMSKAP:
            return medlemskapStepAvailable(values);
        case StepID.SUMMARY:
            return søknadHasBeenSent !== true && oppsummeringStepAvailable(values);
        case RouteConfig.SØKNAD_SENDT_ROUTE:
            return søknadHasBeenSent === true;
    }
    return false;
};
