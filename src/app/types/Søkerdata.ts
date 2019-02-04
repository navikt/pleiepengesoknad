interface Barn {
    fornavn: string;
    etternavn: string;
    mellomnavn: string;
    relasjon: string;
    fodselsnummer: string;
    fodselsdato: string;
}

export interface Ansettelsesforhold {
    navn: string;
    organisasjonsnummer: string;
}

export interface Søkerdata {
    barn: Barn[];
    ansettelsesforhold?: Ansettelsesforhold[];
    setAnsettelsesforhold?: (ansettelsesforhold: Ansettelsesforhold[]) => void;
}
