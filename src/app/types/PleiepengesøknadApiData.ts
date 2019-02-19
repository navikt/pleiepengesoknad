export interface Barn {
    navn: string;
    fodselsnummer?: string;
    alternativ_id?: string;
}

interface Ansettelsesforhold {
    navn: string;
}

export interface PleiepengesøknadApiData {
    barn: Barn;
    relasjon_til_barnet: string;
    fra_og_med: Date;
    til_og_med: Date;
    ansettelsesforhold: { organisasjoner: Ansettelsesforhold[] };
    vedlegg: string[];
}
