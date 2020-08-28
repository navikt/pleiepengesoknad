export interface Arbeidsgiver {
    navn: string;
    organisasjonsnummer: string;
}

export interface ArbeidsgiverResponse {
    organisasjoner: Arbeidsgiver[]
}

export const isArbeidsgiverResponse = (value: any): value is ArbeidsgiverResponse => {
    // TODO: Implement
    return true;
}
