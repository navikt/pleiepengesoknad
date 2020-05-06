export enum HoursOrPercent {
    'hours' = 'hours',
    'percent' = 'percent'
}

export interface BarnReceivedFromApi {
    fornavn: string;
    etternavn: string;
    mellomnavn?: string;
    aktørId: string;
    fødselsdato: Date;
    harSammeAdresse?: boolean;
}

export interface Arbeidsgiver {
    navn: string;
    organisasjonsnummer: string;
}

export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn: string;
    kjønn: string;
    fødselsnummer: string;
    myndig: boolean;
}

export interface Søkerdata {
    person: Person;
    barn: BarnReceivedFromApi[];
    setArbeidsgivere: (arbeidsgivere: Arbeidsgiver[]) => void;
    arbeidsgivere?: Arbeidsgiver[];
}
