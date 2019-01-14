interface Barn {
    fornavn: string;
    etternavn: string;
    mellomnavn: string;
    relasjon: string;
    fodselsnummer: string;
    fodselsdato: string;
}

export interface Søkerdata {
    barn: Barn[];
}
