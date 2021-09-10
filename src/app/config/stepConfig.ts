import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { getSøknadRoute } from '../utils/routeUtils';
import { skalBrukerSvarePåArbeidsforholdIPerioden, skalBrukerSvarePåBeredskapOgNattevåk } from '../utils/stepUtils';
import routeConfig from './routeConfig';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'ARBEIDSFORHOLD' = 'arbeidsforhold',
    'ARBEIDSFORHOLD_I_PERIODEN' = 'arbeidsforholdIPerioden',
    'OMSORGSTILBUD' = 'omsorgstilbud',
    'NATTEVÅK' = 'nattevåk',
    'BEREDSKAP' = 'beredskap',
    'TIDSROM' = 'tidsrom',
    'MEDLEMSKAP' = 'medlemskap',
    'LEGEERKLÆRING' = 'legeerklaering',
    'SUMMARY' = 'oppsummering',
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
    prevStep?: StepID;
    nextStep?: StepID;
    backLinkHref?: string;
    included: boolean;
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
        nextButtonAriaLabel: 'step.nextButtonAriaLabel',
    };
};

export const getStepConfig = (formValues?: PleiepengesøknadFormData): StepConfigInterface => {
    const includeNattevåkAndBeredskap = skalBrukerSvarePåBeredskapOgNattevåk(formValues);
    const includeArbeidsforholdIPerioden = skalBrukerSvarePåArbeidsforholdIPerioden(formValues);

    let idx = 0;
    let config: StepConfigInterface = {
        [StepID.OPPLYSNINGER_OM_BARNET]: {
            ...getStepConfigItemTextKeys(StepID.OPPLYSNINGER_OM_BARNET),
            index: idx++,
            nextStep: StepID.TIDSROM,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
            included: true,
        },
        [StepID.TIDSROM]: {
            ...getStepConfigItemTextKeys(StepID.TIDSROM),
            index: idx++,
            nextStep: StepID.ARBEIDSFORHOLD,
            prevStep: StepID.OPPLYSNINGER_OM_BARNET,
            backLinkHref: getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET),
            included: true,
        },
        [StepID.ARBEIDSFORHOLD]: {
            ...getStepConfigItemTextKeys(StepID.ARBEIDSFORHOLD),
            index: idx++,
            nextStep: includeArbeidsforholdIPerioden ? StepID.ARBEIDSFORHOLD_I_PERIODEN : StepID.OMSORGSTILBUD,
            prevStep: StepID.TIDSROM,
            backLinkHref: getSøknadRoute(StepID.TIDSROM),
            included: true,
        },
    };
    config[StepID.ARBEIDSFORHOLD_I_PERIODEN] = {
        ...getStepConfigItemTextKeys(StepID.ARBEIDSFORHOLD_I_PERIODEN),
        index: includeArbeidsforholdIPerioden ? idx++ : idx,
        nextStep: StepID.OMSORGSTILBUD,
        prevStep: StepID.ARBEIDSFORHOLD,
        backLinkHref: getSøknadRoute(StepID.ARBEIDSFORHOLD),
        included: includeArbeidsforholdIPerioden,
    };
    config[StepID.OMSORGSTILBUD] = {
        ...getStepConfigItemTextKeys(StepID.OMSORGSTILBUD),
        index: idx++,
        nextStep: includeNattevåkAndBeredskap ? StepID.NATTEVÅK : StepID.MEDLEMSKAP,
        prevStep: includeArbeidsforholdIPerioden ? StepID.ARBEIDSFORHOLD_I_PERIODEN : StepID.ARBEIDSFORHOLD,
        backLinkHref: includeArbeidsforholdIPerioden
            ? getSøknadRoute(StepID.ARBEIDSFORHOLD_I_PERIODEN)
            : getSøknadRoute(StepID.ARBEIDSFORHOLD),
        included: true,
    };
    config[StepID.NATTEVÅK] = {
        ...getStepConfigItemTextKeys(StepID.NATTEVÅK),
        index: includeNattevåkAndBeredskap ? idx++ : idx,
        nextStep: StepID.BEREDSKAP,
        prevStep: StepID.OMSORGSTILBUD,
        backLinkHref: getSøknadRoute(StepID.OMSORGSTILBUD),
        included: includeNattevåkAndBeredskap,
    };
    config[StepID.BEREDSKAP] = {
        ...getStepConfigItemTextKeys(StepID.BEREDSKAP),
        index: includeNattevåkAndBeredskap ? idx++ : idx,
        nextStep: StepID.MEDLEMSKAP,
        prevStep: StepID.NATTEVÅK,
        backLinkHref: getSøknadRoute(StepID.NATTEVÅK),
        included: includeNattevåkAndBeredskap,
    };

    config = {
        ...config,
        ...{
            [StepID.MEDLEMSKAP]: {
                ...getStepConfigItemTextKeys(StepID.MEDLEMSKAP),
                index: idx++,
                nextStep: StepID.LEGEERKLÆRING,
                prevStep: includeNattevåkAndBeredskap ? StepID.BEREDSKAP : StepID.OMSORGSTILBUD,
                backLinkHref: getSøknadRoute(includeNattevåkAndBeredskap ? StepID.BEREDSKAP : StepID.OMSORGSTILBUD),
                included: true,
            },
            [StepID.LEGEERKLÆRING]: {
                ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
                index: idx++,
                nextStep: StepID.SUMMARY,
                prevStep: StepID.MEDLEMSKAP,
                backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP),
                included: true,
            },
            [StepID.SUMMARY]: {
                ...getStepConfigItemTextKeys(StepID.SUMMARY),
                index: idx++,
                prevStep: StepID.LEGEERKLÆRING,
                backLinkHref: getSøknadRoute(StepID.LEGEERKLÆRING),
                nextButtonLabel: 'step.sendButtonLabel',
                nextButtonAriaLabel: 'step.sendButtonAriaLabel',
                included: true,
            },
        },
    };
    return config;
};

export const getBackLinkFromNotIncludedStep = (stepId: StepID): string | undefined => {
    if (stepId === StepID.BEREDSKAP || stepId === StepID.NATTEVÅK) {
        return getSøknadRoute(StepID.OMSORGSTILBUD);
    }
    if (stepId === StepID.ARBEIDSFORHOLD_I_PERIODEN) {
        return getSøknadRoute(StepID.ARBEIDSFORHOLD);
    }
    return undefined;
};
export interface StepConfigProps {
    onValidSubmit: () => void;
}

export const stepConfig: StepConfigInterface = getStepConfig();
