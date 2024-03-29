import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { ArbeidsforholdSelvstendigFormValues } from './ArbeidsforholdFormValues';

export enum SelvstendigFormField {
    harHattInntektSomSN = 'selvstendig.harHattInntektSomSN',
    harFlereVirksomheter = 'selvstendig.harFlereVirksomheter',
    virksomhet = 'selvstendig.virksomhet',
    arbeidsforhold = 'selvstendig.arbeidsforhold',
}

export interface SelvstendigFormData {
    harHattInntektSomSN?: YesOrNo;
    harFlereVirksomheter?: YesOrNo;
    virksomhet?: Virksomhet;
    arbeidsforhold?: ArbeidsforholdSelvstendigFormValues;
}
