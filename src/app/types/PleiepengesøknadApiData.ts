import { UtenlandsoppholdÅrsak } from '@sif-common/forms/utenlandsopphold/types';
import { VirksomhetApiData } from '@sif-common/forms/virksomhet/types';
import { ApiStringDate } from '@sif-common/core/types/ApiStringDate';
import { Locale } from '@sif-common/core/types/Locale';
import { TilsynVetIkkeHvorfor } from './PleiepengesøknadFormData';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    fødselsnummer: string | null;
    fødselsdato: string | null;
    aktørId: string | null;
    sammeAdresse: boolean | null;
}

export interface ArbeidsforholdApi {
    navn: string;
    organisasjonsnummer?: string;
    skalJobbe?: 'ja' | 'nei' | 'redusert' | 'vetIkke';
    jobberNormaltTimer?: number;
    skalJobbeTimer?: number;
    skalJobbeProsent?: number;
}
export type ArbeidsforholdApiNei = Pick<
    ArbeidsforholdApi,
    'navn' | 'organisasjonsnummer' | 'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer'
>;
export type ArbeidsforholdApiRedusert = Pick<
    ArbeidsforholdApi,
    'navn' | 'organisasjonsnummer' | 'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer' | 'skalJobbeTimer'
>;

export type ArbeidsforholdApiVetIkke = Pick<
    ArbeidsforholdApi,
    'navn' | 'organisasjonsnummer' | 'skalJobbe' | 'jobberNormaltTimer' | 'skalJobbeProsent'
>;

export type ArbeidsforholdApiSomVanlig = Pick<
    ArbeidsforholdApi,
    'navn' | 'organisasjonsnummer' | 'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer'
>;

export interface TilsynsukeApi {
    mandag?: string;
    tirsdag?: string;
    onsdag?: string;
    torsdag?: string;
    fredag?: string;
}
export type TilsynsordningApi = TilsynsordningApiVetIkke | TilsynsordningApiNei | TilsynsordningApiJa;

interface TilsynsordningApiBase {
    svar: 'ja' | 'nei' | 'vetIkke';
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
    svar: 'vetIkke';
    vetIkke: {
        svar: TilsynVetIkkeHvorfor;
        annet?: string;
    };
}

interface Medlemskap {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdNeste12Mnd: BostedUtlandApiData[];
    utenlandsoppholdSiste12Mnd: BostedUtlandApiData[];
}

export interface BostedUtlandApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    landkode: string;
    landnavn: string;
}

export interface UtenlandsoppholdIPeriodenApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    landkode: string;
    landnavn: string;
}

export interface PeriodeBarnetErInnlagtApiFormat {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
}
export interface UtenlandsoppholdUtenforEøsIPeriodenApiData extends UtenlandsoppholdIPeriodenApiData {
    erBarnetInnlagt: boolean;
    erUtenforEøs: boolean;
    perioderBarnetErInnlagt: PeriodeBarnetErInnlagtApiFormat[];
    årsak: UtenlandsoppholdÅrsak | null;
}

export function isUtenlandsoppholdUtenforEØSApiData(
    opphold: UtenlandsoppholdIPeriodenApiData
): opphold is UtenlandsoppholdUtenforEøsIPeriodenApiData {
    return Object.keys(opphold).includes('erBarnetInnlagt');
}

export interface FerieuttakIPeriodeApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
}

export interface FrilansApiData {
    startdato: ApiStringDate;
    jobberFortsattSomFrilans: boolean;
}

export interface PleiepengesøknadApiData {
    newVersion: boolean;
    språk: Locale;
    barn: BarnToSendToApi;
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    skalBegrefteOmsorg?: boolean;
    skalPassePåBarnetIHelePerioden?: boolean;
    beskrivelseOmsorgsrollen?: string;
    bekrefterPeriodeOver8Uker?: boolean;
    arbeidsgivere: { organisasjoner: ArbeidsforholdApi[] };
    vedlegg: string[];
    medlemskap: Medlemskap;
    utenlandsoppholdIPerioden?: {
        skalOppholdeSegIUtlandetIPerioden: boolean;
        opphold: UtenlandsoppholdIPeriodenApiData[];
    };
    ferieuttakIPerioden?: {
        skalTaUtFerieIPerioden: boolean;
        ferieuttak: FerieuttakIPeriodeApiData[];
    };
    harMedsøker: boolean;
    samtidigHjemme?: boolean;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    tilsynsordning?: TilsynsordningApi;
    nattevåk?: {
        harNattevåk: boolean;
        tilleggsinformasjon?: string;
    };
    beredskap?: {
        beredskap: boolean;
        tilleggsinformasjon?: string;
    };
    harHattInntektSomFrilanser?: boolean;
    harHattInntektSomSelvstendigNæringsdrivende?: boolean;
    frilans?: FrilansApiData;
    selvstendigVirksomheter?: VirksomhetApiData[];
}
