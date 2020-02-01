import { YesOrNo } from 'common/types/YesOrNo';

export enum FrilansOppdragFormField {
    'arbeidsgiverNavn' = 'arbeidsgiverNavn',
    'fom' = 'fom',
    'tom' = 'tom',
    'erPågående' = 'erPågående'
}

export interface FrilansOppdragFormData {
    id?: string;
    [FrilansOppdragFormField.arbeidsgiverNavn]: string;
    [FrilansOppdragFormField.fom]: Date;
    [FrilansOppdragFormField.tom]: Date;
    [FrilansOppdragFormField.erPågående]: YesOrNo;
}
