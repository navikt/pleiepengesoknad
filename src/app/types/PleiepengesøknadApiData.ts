interface Barn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    relasjon: string;
    fodselsnummer: string;
    fodselsdato: Date;
}

interface Ansettelsesforhold {
    navn: string;
}

interface Vedlegg {
    innhold: number[];
}

export interface PleiepengesøknadApiData {
    barn: Barn[];
    fra_og_med: Date;
    til_og_med: Date;
    ansettelsesforhold: Ansettelsesforhold[];
    vedlegg: Vedlegg[];
}
