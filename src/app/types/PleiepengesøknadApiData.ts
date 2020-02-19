import { Næringstype } from '@navikt/sif-common/lib/common/forms/virksomhet/types';
import { UtenlandsoppholdÅrsak } from 'common/forms/utenlandsopphold/types';
import { ApiStringDate } from 'common/types/ApiStringDate';
import { Locale } from 'common/types/Locale';
import { TilsynVetIkkeHvorfor } from './PleiepengesøknadFormData';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    fodselsnummer: string | null;
    fodselsdato: string | null;
    aktoer_id: string | null;
}

export interface ArbeidsforholdApi {
    navn: string;
    organisasjonsnummer?: string;
    skal_jobbe?: 'ja' | 'nei' | 'redusert' | 'vet_ikke';
    jobber_normalt_timer?: number;
    skal_jobbe_timer?: number;
    skal_jobbe_prosent?: number;
}
export type ArbeidsforholdApiNei = Pick<
    ArbeidsforholdApi,
    'navn' | 'organisasjonsnummer' | 'skal_jobbe' | 'skal_jobbe_prosent' | 'jobber_normalt_timer'
>;
export type ArbeidsforholdApiRedusert = Pick<
    ArbeidsforholdApi,
    'navn' | 'organisasjonsnummer' | 'skal_jobbe' | 'skal_jobbe_prosent' | 'jobber_normalt_timer' | 'skal_jobbe_timer'
>;

export type ArbeidsforholdApiVetIkke = Pick<
    ArbeidsforholdApi,
    'navn' | 'organisasjonsnummer' | 'skal_jobbe' | 'jobber_normalt_timer'
>;

export type ArbeidsforholdApiSomVanlig = Pick<
    ArbeidsforholdApi,
    'navn' | 'organisasjonsnummer' | 'skal_jobbe' | 'skal_jobbe_prosent'
>;

export interface ArbeidsforholdApiSkalJobbe {}

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
    utenlandsopphold_neste_12_mnd: BostedUtlandApiData[];
    utenlandsopphold_siste_12_mnd: BostedUtlandApiData[];
}

export interface BostedUtlandApiData {
    fra_og_med: ApiStringDate;
    til_og_med: ApiStringDate;
    landkode: string;
    landnavn: string;
}

export interface UtenlandsoppholdIPeriodenApiData {
    fra_og_med: ApiStringDate;
    til_og_med: ApiStringDate;
    landkode: string;
    landnavn: string;
}

export interface UtenlandsoppholdUtenforEøsIPeriodenApiData extends UtenlandsoppholdIPeriodenApiData {
    er_barnet_innlagt: boolean;
    er_utenfor_eos: boolean;
    arsak: UtenlandsoppholdÅrsak | null;
}

export function isUtenlandsoppholdUtenforEØSApiData(
    opphold: UtenlandsoppholdIPeriodenApiData
): opphold is UtenlandsoppholdUtenforEøsIPeriodenApiData {
    return Object.keys(opphold).includes('er_barnet_innlagt');
}

export interface FerieuttakIPeriodeApiData {
    fra_og_med: ApiStringDate;
    til_og_med: ApiStringDate;
}

export interface FrilansApiData {
    startdato: ApiStringDate;
    jobber_fortsatt_som_frilans: boolean;
    har_hatt_oppdrag_for_familie: boolean;
    har_hatt_inntekt_som_fosterforelder: boolean;
    oppdrag: FrilansoppdragApiData[];
}

export interface FrilansoppdragApiData {
    arbeidsgivernavn: string;
    fra_og_med: ApiStringDate;
    til_og_med: ApiStringDate | null;
    er_pagaende?: boolean;
}

export interface VirksomhetApiData {
    naringstype: Næringstype[];
    fra_og_med: ApiStringDate;
    til_og_med?: ApiStringDate | null;
    er_pagaende?: boolean;
    naringsinntekt: number;
    navn_pa_virksomheten: string;
    organisasjonsnummer?: string;
    registrert_i_norge: boolean;
    registrert_i_land?: string;
    har_blitt_yrkesaktiv_siste_tre_ferdigliknede_arene?: boolean;
    yrkesaktiv_siste_tre_ferdigliknede_arene?: {
        oppstartsdato: ApiStringDate;
    };
    har_varig_endring_av_inntekt_siste_4_kalenderar?: boolean;
    varig_endring?: {
        dato?: ApiStringDate | null;
        inntekt_etter_endring?: number;
        forklaring?: string;
    };
    har_regnskapsforer: boolean;
    regnskapsforer?: {
        navn: string;
        telefon: string;
        er_nar_venn_familie: boolean;
    };
    har_revisor?: boolean;
    revisor?: {
        navn: string;
        telefon: string;
        er_nar_venn_familie: boolean;
        kan_innhente_opplysninger?: boolean;
    };
}

export interface PleiepengesøknadApiData {
    new_version: boolean;
    sprak: Locale;
    barn: BarnToSendToApi;
    fra_og_med: ApiStringDate;
    til_og_med: ApiStringDate;
    arbeidsgivere: { organisasjoner: ArbeidsforholdApi[] };
    vedlegg: string[];
    medlemskap: Medlemskap;
    utenlandsopphold_i_perioden?: {
        skal_oppholde_seg_i_utlandet_i_perioden: boolean;
        opphold: UtenlandsoppholdIPeriodenApiData[];
    };
    ferieuttak_i_perioden?: {
        skal_ta_ut_ferie_i_periode: boolean;
        ferieuttak: FerieuttakIPeriodeApiData[];
    };
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
    har_hatt_inntekt_som_frilanser?: boolean;
    har_hatt_inntekt_som_selvstendig_naringsdrivende?: boolean;
    frilans?: FrilansApiData;
    selvstendig_virksomheter?: VirksomhetApiData[];
}
