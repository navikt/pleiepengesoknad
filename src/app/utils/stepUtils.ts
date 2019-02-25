import { StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import {
    legeerklæringStepIsValid,
    medlemsskapStepIsValid,
    opplysningerOmAnsettelsesforholdStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid
} from '../validation/stepValidations';
import { appIsRunningInDevEnvironment } from './envUtils';

export const opplysningerOmBarnetStepAvailable = (formData: PleiepengesøknadFormData) => welcomingPageIsValid(formData);

export const opplysningerOmTidsromStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) && opplysningerOmBarnetStepIsValid(formData);

export const opplysningerOmAnsettelsesforholdStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData);

export const medlemsskapStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    opplysningerOmAnsettelsesforholdStepIsValid();

export const legeerklæringStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    opplysningerOmAnsettelsesforholdStepIsValid() &&
    medlemsskapStepIsValid(formData);

export const summaryStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    opplysningerOmAnsettelsesforholdStepIsValid() &&
    medlemsskapStepIsValid(formData) &&
    legeerklæringStepIsValid();

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
            case StepID.MEDLEMSSKAP:
                return medlemsskapStepAvailable(values);
            case StepID.SUMMARY:
                return summaryStepAvailable(values);
        }
    }
    return true;
};
