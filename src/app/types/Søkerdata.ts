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
    setAnsettelsesforhold: (ansettelsesforhold: Ansettelsesforhold[]) => void;
    ansettelsesforhold?: Ansettelsesforhold[];
}
