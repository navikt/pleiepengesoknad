import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';

export enum IntroFormField {
    'harLegeerklæring' = 'harLegeerklæring',
    'erArbeidstaker' = 'erArbeidstaker',
}

export interface IntroFormData {
    [IntroFormField.harLegeerklæring]: YesOrNo;
    [IntroFormField.erArbeidstaker]: YesOrNo;
}

export const introFormInitialValues: Partial<IntroFormData> = {
    [IntroFormField.harLegeerklæring]: YesOrNo.UNANSWERED,
    [IntroFormField.erArbeidstaker]: YesOrNo.UNANSWERED,
};
