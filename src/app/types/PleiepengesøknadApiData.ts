import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { ISODateString } from 'nav-datovelger/lib/types';
import { AndreYtelserFraNAV, ArbeidsforholdType, Arbeidsform, BarnRelasjon, JobberSvar, VetOmsorgstilbud } from './';
import { ArbeidsforholdAnsatt } from './PleiepengesøknadFormData';

export type ISO8601Duration = string;

export interface BarnApiData {
    navn: string | null;
    fødselsnummer: string | null;
    fødselsdato: string | null;
    aktørId: string | null;
    sammeAdresse: boolean | null;
}

/** Brukes kun i klient, ikke backend */
export interface ArbeidsforholdApiData {
    skalJobbe?: JobberSvar;
    arbeidsform?: Arbeidsform;
    jobberNormaltTimer?: number;
    erAnsatt?: boolean;
    _type: ArbeidsforholdType;
}

export interface ArbeidsforholdAnsattApiData extends ArbeidsforholdApiData {
    navn: string;
    organisasjonsnummer?: string;
}

export const isArbeidsforholdAnsattApiData = (forhold: any): forhold is ArbeidsforholdAnsatt => {
    return (
        forhold &&
        forhold._type === ArbeidsforholdType.ANSATT &&
        forhold.navn !== undefined &&
        forhold.organisasjonsnummer !== undefined
    );
};

export type ArbeidsforholdApiNei = Pick<
    ArbeidsforholdApiData,
    'skalJobbe' | 'jobberNormaltTimer' | 'arbeidsform' | 'erAnsatt' | '_type'
>;
export type ArbeidsforholdApiRedusert = Pick<
    ArbeidsforholdApiData,
    'skalJobbe' | 'jobberNormaltTimer' | 'arbeidsform' | 'erAnsatt' | '_type'
>;

export type ArbeidsforholdApiVetIkke = Pick<
    ArbeidsforholdApiData,
    'skalJobbe' | 'jobberNormaltTimer' | 'arbeidsform' | 'erAnsatt' | '_type'
>;

export type ArbeidsforholdApiSomVanlig = Pick<
    ArbeidsforholdApiData,
    'skalJobbe' | 'jobberNormaltTimer' | 'arbeidsform' | 'erAnsatt' | '_type'
>;

export interface TidFasteDagerApiData {
    mandag?: ISO8601Duration;
    tirsdag?: ISO8601Duration;
    onsdag?: ISO8601Duration;
    torsdag?: ISO8601Duration;
    fredag?: ISO8601Duration;
}
export interface TidEnkeltdagApiData {
    dato: ISODateString;
    tid: ISO8601Duration;
}

export interface PlanlagtOmsorgstilbudApiData {
    vetOmsorgstilbud: VetOmsorgstilbud;
    erLiktHverUke?: boolean;
    enkeltdager?: TidEnkeltdagApiData[];
    ukedager?: TidFasteDagerApiData;
}

export interface HistoriskOmsorgstilbudApiData {
    enkeltdager: TidEnkeltdagApiData[];
}

export interface OmsorgstilbudApiData {
    historisk?: HistoriskOmsorgstilbudApiData;
    planlagt?: PlanlagtOmsorgstilbudApiData;
}

interface MedlemskapApiData {
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

export interface PeriodeBarnetErInnlagtApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
}
export interface UtenlandsoppholdUtenforEøsIPeriodenApiData extends UtenlandsoppholdIPeriodenApiData {
    erBarnetInnlagt: boolean;
    erUtenforEøs: boolean;
    perioderBarnetErInnlagt: PeriodeBarnetErInnlagtApiData[];
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
    arbeidsforhold?: ArbeidsforholdApiData;
}

export interface PleiepengesøknadApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    barn: BarnApiData;
    barnRelasjon?: BarnRelasjon;
    barnRelasjonBeskrivelse?: string;
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    skalBekrefteOmsorg?: boolean;
    skalPassePåBarnetIHelePerioden?: boolean;
    beskrivelseOmsorgsrollen?: string;
    vedlegg: string[];
    medlemskap: MedlemskapApiData;
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
    omsorgstilbudV2?: OmsorgstilbudApiData;
    nattevåk?: {
        harNattevåk: boolean;
        tilleggsinformasjon?: string;
    };
    beredskap?: {
        beredskap: boolean;
        tilleggsinformasjon?: string;
    };
    arbeidsgivere: { organisasjoner: ArbeidsforholdAnsattApiData[] };
    harHattInntektSomFrilanser: boolean;
    frilans?: FrilansApiData;
    harHattInntektSomSelvstendigNæringsdrivende: boolean;
    selvstendigVirksomheter: VirksomhetApiData[];
    selvstendigArbeidsforhold?: ArbeidsforholdApiData;
    harVærtEllerErVernepliktig?: boolean;
    andreYtelserFraNAV?: AndreYtelserFraNAV[];
}
