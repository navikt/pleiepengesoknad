export enum StepID {
    'RELASJON_TIL_BARN' = 'relasjon-til-barn',
    'STEP2' = 'step2',
    'STEP3' = 'step2'
}

export interface StepItemConfigInterface {
    title: string;
    index: number;
}

export interface StepConfigInterface {
    [key: string]: StepItemConfigInterface;
}

export const stepConfig: StepConfigInterface = {
    [StepID.RELASJON_TIL_BARN]: {
        title: 'Steg 1',
        index: 0
    },
    [StepID.STEP2]: {
        title: 'Steg 2',
        index: 1
    },
    [StepID.STEP3]: {
        title: 'Steg 3',
        index: 2
    }
};
