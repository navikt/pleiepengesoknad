import { Locale } from './Locale';

export interface BarnToSendToApi {
    navn: string | null;
    fodselsnummer: string | null;
    alternativ_id: string | null;
    aktoer_id: string | null;
}

interface Ansettelsesforhold {
    navn: string;
    organisasjonsnummer?: string;
    normal_arbeidsuke?: number;
    redusert_arbeidsuke?: number;
}

interface Medlemskap {
    har_bodd_i_utlandet_siste_12_mnd: boolean;
    skal_bo_i_utlandet_neste_12_mnd: boolean;
}

export interface PleiepengesøknadApiData {
    sprak: Locale;
    barn: BarnToSendToApi;
    relasjon_til_barnet: string | null;
    fra_og_med: Date;
    til_og_med: Date;
    arbeidsgivere: { organisasjoner: Ansettelsesforhold[] };
    vedlegg: string[];
    medlemskap: Medlemskap;
    har_medsoker: boolean;
    grad: number;
    har_forstatt_rettigheter_og_plikter: boolean;
    har_bekreftet_opplysninger: boolean;
}
