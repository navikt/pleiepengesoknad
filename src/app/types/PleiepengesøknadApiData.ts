import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { BarnRelasjon, AndreYtelserFraNAV, TilsynVetIkkeHvorfor, Arbeidsform } from './PleiepengesøknadFormData';

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
    arbeidsform?: Arbeidsform;
    jobberNormaltTimer?: number;
    skalJobbeTimer?: number;
    skalJobbeProsent?: number;
}

export enum SkalJobbe {
    JA = 'JA',
    NEI = 'NEI',
    REDUSERT = 'REDUSERT',
    VET_IKKE = 'VET_IKKE',
}

export interface ArbeidsforholdSNFApi {
    skalJobbe?: SkalJobbe;
    arbeidsform?: Arbeidsform;
    jobberNormaltTimer?: number;
    skalJobbeTimer?: number;
    skalJobbeProsent?: number;
}

export type ArbeidsforholdSNFApiNei = Pick<
    ArbeidsforholdSNFApi,
    'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer'
>;
export type ArbeidsforholdSNFApiRedusert = Pick<
    ArbeidsforholdSNFApi,
    'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer' | 'skalJobbeTimer'
>;

export type ArbeidsforholdSNFApiVetIkke = Pick<
    ArbeidsforholdSNFApi,
    'skalJobbe' | 'jobberNormaltTimer' | 'skalJobbeProsent'
>;

export type ArbeidsforholdSNFApiSomVanlig = Pick<
    ArbeidsforholdSNFApi,
    'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer'
>;

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
    arbeidsforhold?: ArbeidsforholdSNFApi;
}

export interface PleiepengesøknadApiData {
    newVersion: boolean;
    språk: Locale;
    barn: BarnToSendToApi;
    barnRelasjon?: BarnRelasjon;
    barnRelasjonBeskrivelse?: string;
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    skalBekrefteOmsorg?: boolean;
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
    selvstendigVirksomhet?: VirksomhetApiData;
    harFlereVirksomheter?: boolean;
    selvstendigArbeidsforhold?: ArbeidsforholdSNFApi;
    harVærtEllerErVernepliktig: boolean;
    andreYtelserFraNAV?: AndreYtelserFraNAV[];
}
