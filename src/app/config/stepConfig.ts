import routeConfig from './routeConfig';
import { getSøknadRoute } from '../utils/routeUtils';
import { isFeatureEnabled, Feature } from '../utils/featureToggleUtils';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { YesOrNo } from '../types/YesOrNo';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'ANSETTELSESFORHOLD' = 'ansettelsesforhold',
    'TILSYNSORDNING' = 'tilsynsordning',
    'NATTEVÅK_OG_BEREDSKAP' = 'nattevåkOgBeredskap',
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

export const getStepConfig = (formValues?: PleiepengesøknadFormData) => {
    const tilsynIsEnabled = isFeatureEnabled(Feature.TOGGLE_TILSYN);
    const includeNattevåk =
        tilsynIsEnabled &&
        formValues &&
        formValues.tilsynsordning &&
        formValues.tilsynsordning.skalBarnHaTilsyn === YesOrNo.YES;
    let idx = 0;
    let config = {
        [StepID.OPPLYSNINGER_OM_BARNET]: {
            ...getStepConfigItemTextKeys(StepID.OPPLYSNINGER_OM_BARNET),
            index: idx++,
            nextStep: StepID.TIDSROM,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE
        },
        [StepID.TIDSROM]: {
            ...getStepConfigItemTextKeys(StepID.TIDSROM),
            index: idx++,
            nextStep: StepID.ANSETTELSESFORHOLD,
            backLinkHref: getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET)
        },
        [StepID.ANSETTELSESFORHOLD]: {
            ...getStepConfigItemTextKeys(StepID.ANSETTELSESFORHOLD),
            index: idx++,
            nextStep: tilsynIsEnabled ? StepID.TILSYNSORDNING : StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.TIDSROM)
        }
    };

    let backLinkStep: StepID = StepID.ANSETTELSESFORHOLD;
    if (tilsynIsEnabled) {
        config[StepID.TILSYNSORDNING] = {
            ...getStepConfigItemTextKeys(StepID.TILSYNSORDNING),
            index: idx++,
            nextStep: includeNattevåk ? StepID.NATTEVÅK_OG_BEREDSKAP : StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.ANSETTELSESFORHOLD)
        };
        backLinkStep = StepID.TILSYNSORDNING;
        if (includeNattevåk) {
            config[StepID.NATTEVÅK_OG_BEREDSKAP] = {
                ...getStepConfigItemTextKeys(StepID.NATTEVÅK_OG_BEREDSKAP),
                index: idx++,
                nextStep: StepID.MEDLEMSKAP,
                backLinkHref: getSøknadRoute(StepID.TILSYNSORDNING)
            };
            backLinkStep = StepID.NATTEVÅK_OG_BEREDSKAP;
        }
    }

    config = {
        ...config,
        ...{
            [StepID.MEDLEMSKAP]: {
                ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
                index: idx++,
                nextStep: StepID.LEGEERKLÆRING,
                backLinkHref: getSøknadRoute(backLinkStep)
            },
            [StepID.LEGEERKLÆRING]: {
                ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
                index: idx++,
                nextStep: StepID.SUMMARY,
                backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP)
            },
            [StepID.SUMMARY]: {
                ...getStepConfigItemTextKeys(StepID.SUMMARY),
                index: idx++,
                backLinkHref: getSøknadRoute(StepID.LEGEERKLÆRING),
                nextButtonLabel: 'step.sendButtonLabel',
                nextButtonAriaLabel: 'step.sendButtonAriaLabel'
            }
        }
    };
    return config;
};

export interface StepConfigProps {
    nextStepRoute: string | undefined;
}

export const stepConfig: StepConfigInterface = getStepConfig();
