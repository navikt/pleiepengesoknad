export enum StepID {
    'RELASJON_TIL_BARN' = 'relasjon-til-barn',
    'MEDLEMSSKAP' = 'medlemsskap',
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
    [StepID.RELASJON_TIL_BARN]: {
        title: 'Ny pleiepengesøknad - din relasjon til barnet',
        index: 0,
        nextStep: StepID.MEDLEMSSKAP,
        buttonLabel: 'Fortsett'
    },
    [StepID.MEDLEMSSKAP]: {
        title: 'Ny pleiepengesøknad - ditt medlemsskap',
        index: 1,
        nextStep: StepID.SUMMARY,
        buttonLabel: 'Fortsett'
    },
    [StepID.SUMMARY]: {
        title: 'Ny pleiepengesøknad - oppsummering',
        index: 2,
        buttonLabel: 'Fortsett'
    }
};
