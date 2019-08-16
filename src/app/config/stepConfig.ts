import routeConfig from './routeConfig';
import { getSøknadRoute } from '../utils/routeUtils';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'ANSETTELSESFORHOLD' = 'ansettelsesforhold',
    'TIDSROM' = 'tidsrom',
    'MEDLEMSKAP' = 'medlemskap',
    'LEGEERKLÆRING' = 'legeerklaering',
    'SUMMARY' = 'oppsummering'
}

export interface StepConfigItemTexts {
    pageTitle: string;
    stepTitle: string;
    stepIndicatorLabel: string;
    nextButtonLabel?: string;
    nextButtonAriaLabel?: string;
}
export interface StepItemConfigInterface extends StepConfigItemTexts {
    index: number;
    nextStep?: StepID;
    backLinkHref?: string;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

const getStepConfigItemTextKeys = (stepId: StepID): StepConfigItemTexts => {
    return {
        pageTitle: `step.${stepId}.pageTitle`,
        stepTitle: `step.${stepId}.stepTitle`,
        stepIndicatorLabel: `step.${stepId}.stepIndicatorLabel`,
        nextButtonLabel: 'step.nextButtonLabel',
        nextButtonAriaLabel: 'step.nextButtonAriaLabel'
    };
};

export const stepConfig: StepConfigInterface = {
    [StepID.OPPLYSNINGER_OM_BARNET]: {
        ...getStepConfigItemTextKeys(StepID.OPPLYSNINGER_OM_BARNET),
        index: 0,
        nextStep: StepID.TIDSROM,
        backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE
    },
    [StepID.TIDSROM]: {
        ...getStepConfigItemTextKeys(StepID.TIDSROM),
        index: 1,
        nextStep: StepID.ANSETTELSESFORHOLD,
        backLinkHref: getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)
    },
    [StepID.ANSETTELSESFORHOLD]: {
        ...getStepConfigItemTextKeys(StepID.ANSETTELSESFORHOLD),
        index: 2,
        nextStep: StepID.MEDLEMSKAP,
        backLinkHref: getSøknadRoute(StepID.TIDSROM)
    },
    [StepID.MEDLEMSKAP]: {
        ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
        index: 3,
        nextStep: StepID.LEGEERKLÆRING,
        backLinkHref: getSøknadRoute(StepID.ANSETTELSESFORHOLD)
    },
    [StepID.LEGEERKLÆRING]: {
        ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
        index: 4,
        nextStep: StepID.SUMMARY,
        backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP)
    },
    [StepID.SUMMARY]: {
        ...getStepConfigItemTextKeys(StepID.SUMMARY),
        index: 5,
        backLinkHref: getSøknadRoute(StepID.LEGEERKLÆRING),
        nextButtonLabel: 'step.sendButtonLabel',
        nextButtonAriaLabel: 'step.sendButtonAriaLabel'
    }
};
