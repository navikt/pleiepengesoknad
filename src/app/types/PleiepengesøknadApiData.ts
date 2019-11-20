import { Locale } from './Locale';
import { TilsynVetIkkeHvorfor } from './PleiepengesøknadFormData';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    fodselsnummer: string | null;
    alternativ_id: string | null;
    aktoer_id: string | null;
}

export interface AnsettelsesforholdApi {
    navn: string;
    organisasjonsnummer?: string;
    skal_jobbe?: 'ja' | 'nei' | 'redusert' | 'vet_ikke';
    jobber_normalt_timer?: number;
    skal_jobbe_timer?: number;
    skal_jobbe_prosent?: number;
    vet_ikke_ekstrainfo?: string;
}
export type AnsettelsesforholdApiNei = Pick<
    AnsettelsesforholdApi,
    'navn' | 'organisasjonsnummer' | 'skal_jobbe' | 'skal_jobbe_prosent' | 'jobber_normalt_timer'
>;
export type AnsettelsesforholdApiRedusert = Pick<
    AnsettelsesforholdApi,
    'navn' | 'organisasjonsnummer' | 'skal_jobbe' | 'skal_jobbe_prosent' | 'jobber_normalt_timer' | 'skal_jobbe_timer'
>;

export type AnsettelsesforholdApiVetIkke = Pick<
    AnsettelsesforholdApi,
    'navn' | 'organisasjonsnummer' | 'skal_jobbe' | 'jobber_normalt_timer' | 'vet_ikke_ekstrainfo'
>;

export type AnsettelsesforholdApiSomVanlig = Pick<
    AnsettelsesforholdApi,
    'navn' | 'organisasjonsnummer' | 'skal_jobbe' | 'skal_jobbe_prosent'
>;

export interface AnsettelsesforholdApiSkalJobbe {}

export interface TilsynsukeApi {
    mandag?: string;
    tirsdag?: string;
    onsdag?: string;
    torsdag?: string;
    fredag?: string;
}
export type TilsynsordningApi = TilsynsordningApiVetIkke | TilsynsordningApiNei | TilsynsordningApiJa;

interface TilsynsordningApiBase {
    svar: 'ja' | 'nei' | 'vet_ikke';
}
export interface TilsynsordningApiNei extends TilsynsordningApiBase {
    svar: 'nei';
}
export interface TilsynsordningApiJa extends TilsynsordningApiBase {
    svar: 'ja';
    ja: {
        mandag?: string;
        tirsdag?: string;
        onsdag?: string;
        torsdag?: string;
        fredag?: string;
        tilleggsinformasjon?: string;
    };
}
export interface TilsynsordningApiVetIkke extends TilsynsordningApiBase {
    svar: 'vet_ikke';
    vet_ikke: {
        svar: TilsynVetIkkeHvorfor;
        annet?: string;
    };
}

interface Medlemskap {
    har_bodd_i_utlandet_siste_12_mnd: boolean;
    skal_bo_i_utlandet_neste_12_mnd: boolean;
}

export interface PleiepengesøknadApiData {
    new_version: boolean;
    sprak: Locale;
    barn: BarnToSendToApi;
    relasjon_til_barnet: string | null;
    fra_og_med: Date;
    til_og_med: Date;
    arbeidsgivere: { organisasjoner: AnsettelsesforholdApi[] };
    vedlegg: string[];
    medlemskap: Medlemskap;
    har_medsoker: boolean;
    samtidig_hjemme?: boolean;
    har_forstatt_rettigheter_og_plikter: boolean;
    har_bekreftet_opplysninger: boolean;
    tilsynsordning?: TilsynsordningApi;
    nattevaak?: {
        har_nattevaak: boolean;
        tilleggsinformasjon?: string;
    };
    beredskap?: {
        i_beredskap: boolean;
        tilleggsinformasjon?: string;
    };
}
