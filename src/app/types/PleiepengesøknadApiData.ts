interface Barn {
    fornavn: string;
    mellomnavn: string;
    etternavn: string;
    relasjon: string;
    fodselsnummer: string;
    fodselsdato: string;
}

interface Ansettelsesforhold {
    navn: string;
}

interface Vedlegg {
    innhold: string;
}

export interface PleiepengesøknadApiData {
    barn: Barn[];
    fra_og_med: string;
    til_og_med: string;
    ansettelsesforhold: Ansettelsesforhold[];
    vedlegg: Vedlegg[];
}
