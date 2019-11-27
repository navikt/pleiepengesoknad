import routeConfig from './routeConfig';
import { getSøknadRoute } from '../utils/routeUtils';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { YesOrNo } from '../types/YesOrNo';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'ANSETTELSESFORHOLD' = 'ansettelsesforhold',
    'OMSORGSTILBUD' = 'omsorgstilbud',
    'NATTEVÅK' = 'nattevåk',
    'BEREDSKAP' = 'beredskap',
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
    const includeNattevåkAndBeredskap =
        formValues &&
        formValues.tilsynsordning &&
        (formValues.tilsynsordning.skalBarnHaTilsyn === YesOrNo.YES ||
            formValues.tilsynsordning.skalBarnHaTilsyn === YesOrNo.DO_NOT_KNOW);
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
            nextStep: StepID.OMSORGSTILBUD,
            backLinkHref: getSøknadRoute(StepID.TIDSROM)
        },
        [StepID.OMSORGSTILBUD]: {
            ...getStepConfigItemTextKeys(StepID.OMSORGSTILBUD),
            index: idx++,
            nextStep: includeNattevåkAndBeredskap ? StepID.NATTEVÅK : StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.ANSETTELSESFORHOLD)
        }
    };

    let backLinkStep: StepID = StepID.OMSORGSTILBUD;
    if (includeNattevåkAndBeredskap) {
        config[StepID.NATTEVÅK] = {
            ...getStepConfigItemTextKeys(StepID.NATTEVÅK),
            index: idx++,
            nextStep: StepID.BEREDSKAP,
            backLinkHref: getSøknadRoute(StepID.OMSORGSTILBUD)
        };
        config[StepID.BEREDSKAP] = {
            ...getStepConfigItemTextKeys(StepID.BEREDSKAP),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.NATTEVÅK)
        };
        backLinkStep = StepID.BEREDSKAP;
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
