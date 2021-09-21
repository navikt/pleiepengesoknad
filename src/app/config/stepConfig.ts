import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { getSøknadsperiodeFromFormData } from '../utils/formDataUtils';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../utils/omsorgstilbudUtils';
import { getSøknadRoute } from '../utils/routeUtils';
import { skalBrukerSvarePåArbeidsforholdIPerioden, skalBrukerSvarePåBeredskapOgNattevåk } from '../utils/stepUtils';

export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'ARBEIDSFORHOLD' = 'arbeidsforhold',
    'ARBEID_HISTORISK' = 'arbeidHistorisk',
    'ARBEID_PLANLAGT' = 'arbeidPlanlagt',
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

interface ConfigStepHelperType {
    stepID: StepID;
    included: boolean;
}

export const getStepConfig = (formValues?: PleiepengesøknadFormData): StepConfigInterface => {
    const søknadsperiode = formValues ? getSøknadsperiodeFromFormData(formValues) : undefined;
    const periodeFørSøknadsdato = søknadsperiode ? getHistoriskPeriode(søknadsperiode, dateToday) : undefined;
    const periodeFraOgMedSøknadsdato = søknadsperiode ? getPlanlagtPeriode(søknadsperiode, dateToday) : undefined;

    const includeNattevåkAndBeredskap = skalBrukerSvarePåBeredskapOgNattevåk(formValues);
    const includeArbeidIPerioden = skalBrukerSvarePåArbeidsforholdIPerioden(formValues);

    const allSteps: ConfigStepHelperType[] = [
        { stepID: StepID.OPPLYSNINGER_OM_BARNET, included: true },
        { stepID: StepID.TIDSROM, included: true },
        { stepID: StepID.ARBEIDSFORHOLD, included: true },
        { stepID: StepID.ARBEID_HISTORISK, included: includeArbeidIPerioden && periodeFørSøknadsdato !== undefined },
        {
            stepID: StepID.ARBEID_PLANLAGT,
            included: includeArbeidIPerioden && periodeFraOgMedSøknadsdato !== undefined,
        },
        { stepID: StepID.OMSORGSTILBUD, included: true },
        { stepID: StepID.NATTEVÅK, included: includeNattevåkAndBeredskap },
        { stepID: StepID.BEREDSKAP, included: includeNattevåkAndBeredskap },
        { stepID: StepID.MEDLEMSKAP, included: true },
        { stepID: StepID.LEGEERKLÆRING, included: true },
        { stepID: StepID.SUMMARY, included: true },
    ];

    const includedSteps = allSteps.filter((s) => s.included);

    const getNextStep = (stepID: StepID): StepID | undefined => {
        const idx = includedSteps.findIndex((s) => s.stepID === stepID);
        return idx > -1 && idx < includedSteps.length - 1 ? includedSteps[idx + 1].stepID : undefined;
    };

    const getPreviousStep = (stepID: StepID): StepID | undefined => {
        const idx = includedSteps.findIndex((s) => s.stepID === stepID);
        return idx >= 1 ? includedSteps[idx - 1].stepID : undefined;
    };

    const config: StepConfigInterface = {};
    allSteps.forEach(({ stepID, included }, index) => {
        const nextStep = getNextStep(stepID);
        const prevStep = getPreviousStep(stepID);
        const backLinkHref = prevStep ? getSøknadRoute(prevStep) : undefined;
        config[stepID] = {
            ...getStepConfigItemTextKeys(stepID),
            index,
            nextStep,
            prevStep,
            backLinkHref,
            included,
        };
    });
    return config;
};

export const getBackLinkFromNotIncludedStep = (stepId: StepID): string | undefined => {
    if (stepId === StepID.BEREDSKAP || stepId === StepID.NATTEVÅK) {
        return getSøknadRoute(StepID.OMSORGSTILBUD);
    }
    if (stepId === StepID.ARBEID_HISTORISK || stepId === StepID.ARBEID_PLANLAGT) {
        return getSøknadRoute(StepID.ARBEIDSFORHOLD);
    }
    return undefined;
};
export interface StepConfigProps {
    onValidSubmit: () => void;
}

export const stepConfig: StepConfigInterface = getStepConfig();
