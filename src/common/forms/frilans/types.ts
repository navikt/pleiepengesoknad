export enum FrilansoppdragFormField {
    'arbeidsgiverNavn' = 'arbeidsgiverNavn',
    'fom' = 'fom',
    'tom' = 'tom',
    'erPågående' = 'erPågående'
}

export interface FrilansoppdragFormData {
    id?: string;
    [FrilansoppdragFormField.arbeidsgiverNavn]: string;
    [FrilansoppdragFormField.fom]: Date;
    [FrilansoppdragFormField.tom]: Date;
    [FrilansoppdragFormField.erPågående]: boolean;
}
