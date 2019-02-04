export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'ARBEIDSFORHOLD' = 'arbeidsforhold',
    'TIDSROM' = 'tidsrom',
    'LEGEERKLÆRING' = 'legeerklaering',
    'SUMMARY' = 'oppsummering'
}

export interface StepItemConfigInterface {
    pageTitle: string;
    stepTitle: string;
    index: number;
    nextStep?: StepID;
    buttonLabel?: string;
    stepIndicatorLabel: string;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

export const stepConfig: StepConfigInterface = {
    [StepID.OPPLYSNINGER_OM_BARNET]: {
        pageTitle: 'Pleiepengesøknad - opplysninger om barnet',
        stepTitle: 'Barn',
        stepIndicatorLabel: 'Om barnet',
        index: 0,
        nextStep: StepID.TIDSROM,
        buttonLabel: 'Fortsett'
    },
    [StepID.TIDSROM]: {
        pageTitle: 'Pleiepengesøknad',
        stepTitle: 'Egenerklæring',
        stepIndicatorLabel: 'Tidsrom',
        index: 1,
        nextStep: StepID.ARBEIDSFORHOLD,
        buttonLabel: 'Fortsett'
    },
    [StepID.ARBEIDSFORHOLD]: {
        pageTitle: 'Pleiepengesøknad - opplysninger om ditt arbeidsforhold',
        stepTitle: 'Arbeidsforhold',
        stepIndicatorLabel: 'Om ditt arbeidsforhold',
        index: 2,
        nextStep: StepID.LEGEERKLÆRING,
        buttonLabel: 'Fortsett'
    },
    [StepID.LEGEERKLÆRING]: {
        pageTitle: 'Pleiepengesøknad - legeerklæring',
        stepTitle: 'Last opp legeerklæring',
        stepIndicatorLabel: 'Last opp din legeerklæring',
        index: 3,
        nextStep: StepID.SUMMARY,
        buttonLabel: 'Fortsett'
    },
    [StepID.SUMMARY]: {
        pageTitle: 'Pleiepengesøknad - oppsummering',
        stepTitle: 'Oppsummering',
        stepIndicatorLabel: 'Oppsummering',
        index: 4,
        buttonLabel: 'Send inn søknaden'
    }
};
