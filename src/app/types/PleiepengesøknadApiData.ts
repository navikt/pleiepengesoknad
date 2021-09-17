import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { ISODateString } from 'nav-datovelger/lib/types';
import { BarnRelasjon, AndreYtelserFraNAV, Arbeidsform, ArbeidsforholdAnsatt } from './PleiepengesøknadFormData';

export type ISO8601Duration = string;

export interface BarnToSendToApi {
    navn: string | null;
    fødselsnummer: string | null;
    fødselsdato: string | null;
    aktørId: string | null;
    sammeAdresse: boolean | null;
}

export enum SkalJobbe {
    JA = 'JA',
    NEI = 'NEI',
    REDUSERT = 'REDUSERT',
    VET_IKKE = 'VET_IKKE',
}

/** Brukes kun i klient, ikke backend */
export enum ArbeidsforholdType {
    ANSATT = 'ANSATT',
    FRILANSER = 'FRILANSER',
    SELVSTENDIG = 'SELVSTENDIG',
}
export interface ArbeidsforholdApi {
    skalJobbe?: SkalJobbe;
    arbeidsform?: Arbeidsform;
    jobberNormaltTimer?: number;
    skalJobbeTimer?: number;
    skalJobbeProsent?: number;
    erAnsatt?: boolean;
    _type: ArbeidsforholdType;
}

export interface ArbeidsforholdAnsattApi extends ArbeidsforholdApi {
    navn: string;
    organisasjonsnummer?: string;
}

export const isArbeidsforholdAnsattApi = (forhold: any): forhold is ArbeidsforholdAnsatt => {
    return (
        forhold &&
        forhold._type === ArbeidsforholdType.ANSATT &&
        forhold.navn !== undefined &&
        forhold.organisasjonsnummer !== undefined
    );
};

export type ArbeidsforholdApiNei = Pick<
    ArbeidsforholdApi,
    'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer' | 'arbeidsform' | 'erAnsatt' | '_type'
>;
export type ArbeidsforholdApiRedusert = Pick<
    ArbeidsforholdApi,
    'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer' | 'skalJobbeTimer' | 'arbeidsform' | 'erAnsatt' | '_type'
>;

export type ArbeidsforholdApiVetIkke = Pick<
    ArbeidsforholdApi,
    'skalJobbe' | 'jobberNormaltTimer' | 'skalJobbeProsent' | 'arbeidsform' | 'erAnsatt' | '_type'
>;

export type ArbeidsforholdApiSomVanlig = Pick<
    ArbeidsforholdApi,
    'skalJobbe' | 'skalJobbeProsent' | 'jobberNormaltTimer' | 'arbeidsform' | 'erAnsatt' | '_type'
>;

export interface OmsorgstilbudUkeApi {
    mandag?: string;
    tirsdag?: string;
    onsdag?: string;
    torsdag?: string;
    fredag?: string;
}

export interface OmsorgstilbudFasteDagerApi {
    mandag?: ISO8601Duration;
    tirsdag?: ISO8601Duration;
    onsdag?: ISO8601Duration;
    torsdag?: ISO8601Duration;
    fredag?: ISO8601Duration;
}
export interface OmsorgstilbudDagApi {
    dato: ISODateString;
    tid: ISO8601Duration;
}
export enum VetOmsorgstilbud {
    'VET_ALLE_TIMER' = 'VET_ALLE_TIMER',
    'VET_IKKE' = 'VET_IKKE',
}

export interface PlanlagtOmsorgstilbudApi {
    vetOmsorgstilbud: VetOmsorgstilbud;
    erLiktHverDag?: boolean;
    enkeltdager?: OmsorgstilbudDagApi[];
    ukedager?: OmsorgstilbudFasteDagerApi;
}

export interface HistoriskOmsorgstilbudApi {
    enkeltdager: OmsorgstilbudDagApi[];
}

export interface OmsorgstilbudV2 {
    historisk?: HistoriskOmsorgstilbudApi;
    planlagt?: PlanlagtOmsorgstilbudApi;
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
    sluttdato?: ApiStringDate;
    arbeidsforhold?: ArbeidsforholdApi;
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
    arbeidsgivere: { organisasjoner: ArbeidsforholdAnsattApi[] };
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
    omsorgstilbudV2?: OmsorgstilbudV2;
    nattevåk?: {
        harNattevåk: boolean;
        tilleggsinformasjon?: string;
    };
    beredskap?: {
        beredskap: boolean;
        tilleggsinformasjon?: string;
    };
    harHattInntektSomFrilanser: boolean;
    frilans?: FrilansApiData;
    harHattInntektSomSelvstendigNæringsdrivende: boolean;
    selvstendigVirksomheter: VirksomhetApiData[];
    selvstendigArbeidsforhold?: ArbeidsforholdApi;
    harVærtEllerErVernepliktig?: boolean;
    andreYtelserFraNAV?: AndreYtelserFraNAV[];
}
