export enum StepID {
    'OPPLYSNINGER_OM_BARNET' = 'opplysninger-om-barnet',
    'ARBEIDSFORHOLD' = 'arbeidsforhold',
    'SUMMARY' = 'oppsummering'
}

export interface StepItemConfigInterface {
    title: string;
    index: number;
    nextStep?: StepID;
    buttonLabel?: string;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

export const stepConfig: StepConfigInterface = {
    [StepID.OPPLYSNINGER_OM_BARNET]: {
        title: 'Ny pleiepengesøknad - opplysninger om barnet',
        index: 0,
        nextStep: StepID.ARBEIDSFORHOLD,
        buttonLabel: 'Fortsett'
    },
    [StepID.ARBEIDSFORHOLD]: {
        title: 'Ny pleiepengesøknad - opplysninger om ditt arbeidsforhold',
        index: 1,
        nextStep: StepID.SUMMARY,
        buttonLabel: 'Fortsett'
    },
    [StepID.SUMMARY]: {
        title: 'Ny pleiepengesøknad - oppsummering',
        index: 2,
        buttonLabel: 'Send inn søknaden'
    }
};
