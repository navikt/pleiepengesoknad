import { StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import {
    legeerklæringStepIsValid,
    opplysningerOmAnsettelsesforholdStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid
} from './validation/stepValidations';

export const opplysningerOmBarnetAvailable = (formData: PleiepengesøknadFormData) => welcomingPageIsValid(formData);

export const opplysningerOmTidsromAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) && opplysningerOmBarnetStepIsValid(formData);

export const opplysningerOmAnsettelsesforholdAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData);

export const legeerklæringStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    opplysningerOmAnsettelsesforholdStepIsValid();

export const summaryStepAvailable = (formData: PleiepengesøknadFormData) =>
    welcomingPageIsValid(formData) &&
    opplysningerOmBarnetStepIsValid(formData) &&
    opplysningerOmTidsromStepIsValid(formData) &&
    opplysningerOmAnsettelsesforholdStepIsValid() &&
    legeerklæringStepIsValid();

export const stepRouteIsAvailable = (stepId: StepID, values: PleiepengesøknadFormData) => {
    switch (stepId) {
        case StepID.OPPLYSNINGER_OM_BARNET:
            return opplysningerOmBarnetAvailable(values);
        case StepID.TIDSROM:
            return opplysningerOmTidsromAvailable(values);
        case StepID.ANSETTELSESFORHOLD:
            return opplysningerOmAnsettelsesforholdAvailable(values);
        case StepID.LEGEERKLÆRING:
            return legeerklæringStepAvailable(values);
        case StepID.SUMMARY:
            return summaryStepAvailable(values);
    }
};
