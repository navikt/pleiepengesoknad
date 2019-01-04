interface Barn {
    fornavn: string;
    etternavn: string;
    mellomnavn: string;
    relasjon: string;
    fødselsnummer: string;
    fødselsdato: string;
}

export interface Søkerdata {
    barn: Barn[];
}
