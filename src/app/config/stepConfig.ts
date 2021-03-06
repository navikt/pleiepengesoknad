import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { erFrilanserISøknadsperiode } from '../utils/frilanserUtils';
import { getSøknadRoute } from '../utils/routeUtils';
import { skalBrukerSvarePåBeredskapOgNattevåk } from '../utils/stepUtils';
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
        nextButtonAriaLabel: 'step.nextButtonAriaLabel',
    };
};

export const getStepConfig = (formValues?: PleiepengesøknadFormData) => {
    const includeNattevåkAndBeredskap = skalBrukerSvarePåBeredskapOgNattevåk(formValues);
    const includeArbeidsforholdIPerioden =
        formValues &&
        (formValues.arbeidsforhold.find((a) => a.erAnsattIPerioden === YesOrNo.YES) !== undefined ||
            formValues.frilans_jobberFortsattSomFrilans === YesOrNo.YES ||
            (formValues.frilans_jobberFortsattSomFrilans === YesOrNo.NO &&
                erFrilanserISøknadsperiode(formValues.periodeFra, formValues.frilans_sluttdato)) ||
            formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES);

    let idx = 0;
    let config = {
        [StepID.OPPLYSNINGER_OM_BARNET]: {
            ...getStepConfigItemTextKeys(StepID.OPPLYSNINGER_OM_BARNET),
            index: idx++,
            nextStep: StepID.TIDSROM,
            backLinkHref: routeConfig.WELCOMING_PAGE_ROUTE,
        },
        [StepID.TIDSROM]: {
            ...getStepConfigItemTextKeys(StepID.TIDSROM),
            index: idx++,
            nextStep: StepID.ARBEIDSFORHOLD,
            backLinkHref: getSøknadRoute(StepID.OPPLYSNINGER_OM_BARNET),
        },
        [StepID.ARBEIDSFORHOLD]: {
            ...getStepConfigItemTextKeys(StepID.ARBEIDSFORHOLD),
            index: idx++,
            nextStep: includeArbeidsforholdIPerioden ? StepID.ARBEIDSFORHOLD_I_PERIODEN : StepID.OMSORGSTILBUD,
            backLinkHref: getSøknadRoute(StepID.TIDSROM),
        },
    };
    if (includeArbeidsforholdIPerioden) {
        config[StepID.ARBEIDSFORHOLD_I_PERIODEN] = {
            ...getStepConfigItemTextKeys(StepID.ARBEIDSFORHOLD_I_PERIODEN),
            index: idx++,
            nextStep: StepID.OMSORGSTILBUD,
            backLinkHref: getSøknadRoute(StepID.ARBEIDSFORHOLD),
        };
    }
    config[StepID.OMSORGSTILBUD] = {
        ...getStepConfigItemTextKeys(StepID.OMSORGSTILBUD),
        index: idx++,
        nextStep: includeNattevåkAndBeredskap ? StepID.NATTEVÅK : StepID.MEDLEMSKAP,
        backLinkHref: includeArbeidsforholdIPerioden
            ? getSøknadRoute(StepID.ARBEIDSFORHOLD_I_PERIODEN)
            : getSøknadRoute(StepID.ARBEIDSFORHOLD),
    };
    let backLinkStep: StepID = StepID.OMSORGSTILBUD;
    if (includeNattevåkAndBeredskap) {
        config[StepID.NATTEVÅK] = {
            ...getStepConfigItemTextKeys(StepID.NATTEVÅK),
            index: idx++,
            nextStep: StepID.BEREDSKAP,
            backLinkHref: getSøknadRoute(StepID.OMSORGSTILBUD),
        };
        config[StepID.BEREDSKAP] = {
            ...getStepConfigItemTextKeys(StepID.BEREDSKAP),
            index: idx++,
            nextStep: StepID.MEDLEMSKAP,
            backLinkHref: getSøknadRoute(StepID.NATTEVÅK),
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
                backLinkHref: getSøknadRoute(backLinkStep),
            },
            [StepID.LEGEERKLÆRING]: {
                ...getStepConfigItemTextKeys(StepID.LEGEERKLÆRING),
                index: idx++,
                nextStep: StepID.SUMMARY,
                backLinkHref: getSøknadRoute(StepID.MEDLEMSKAP),
            },
            [StepID.SUMMARY]: {
                ...getStepConfigItemTextKeys(StepID.SUMMARY),
                index: idx++,
                backLinkHref: getSøknadRoute(StepID.LEGEERKLÆRING),
                nextButtonLabel: 'step.sendButtonLabel',
                nextButtonAriaLabel: 'step.sendButtonAriaLabel',
            },
        },
    };
    return config;
};

export interface StepConfigProps {
    onValidSubmit: () => void;
}

export const stepConfig: StepConfigInterface = getStepConfig();
