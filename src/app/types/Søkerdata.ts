export enum HoursOrPercent {
    'hours' = 'hours',
    'percent' = 'percent'
}

export interface BarnReceivedFromApi {
    fornavn: string;
    etternavn: string;
    mellomnavn?: string;
    aktoer_id: string;
    fodselsdato: Date;
}

export interface Ansettelsesforhold {
    navn: string;
    organisasjonsnummer: string;
}

export interface Person {
    etternavn: string;
    fornavn: string;
    mellomnavn: string;
    kjonn: string;
    fodselsnummer: string;
    myndig: boolean;
}

export interface Søkerdata {
    person: Person;
    barn: BarnReceivedFromApi[];
    setAnsettelsesforhold: (ansettelsesforhold: Ansettelsesforhold[]) => void;
    ansettelsesforhold?: Ansettelsesforhold[];
}
