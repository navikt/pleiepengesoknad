export enum StepID {
    'TIDSROM' = 'tidsrom',
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'ARBEIDSFORHOLD' = 'arbeidsforhold',
    'SUMMARY' = 'oppsummering'
}

export interface StepItemConfigInterface {
    title: string;
    index: number;
    nextStep?: StepID;
    buttonLabel?: string;
    stepIndicatorLabel: string;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

export const stepConfig: StepConfigInterface = {
    [StepID.TIDSROM]: {
        title: 'Pleiepengesøknad',
        stepIndicatorLabel: 'Tidsrom',
        index: 0,
        nextStep: StepID.OPPLYSNINGER_OM_BARNET,
        buttonLabel: 'Fortsett'
    },
    [StepID.OPPLYSNINGER_OM_BARNET]: {
        title: 'Pleiepengesøknad - opplysninger om barnet',
        stepIndicatorLabel: 'Om barnet',
        index: 1,
        nextStep: StepID.ARBEIDSFORHOLD,
        buttonLabel: 'Fortsett'
    },
    [StepID.ARBEIDSFORHOLD]: {
        title: 'Pleiepengesøknad - opplysninger om ditt arbeidsforhold',
        stepIndicatorLabel: 'Om ditt arbeidsforhold',
        index: 2,
        nextStep: StepID.SUMMARY,
        buttonLabel: 'Fortsett'
    },
    [StepID.SUMMARY]: {
        title: 'Pleiepengesøknad - oppsummering',
        stepIndicatorLabel: 'Oppsummering',
        index: 3,
        buttonLabel: 'Send inn søknaden'
    }
};
