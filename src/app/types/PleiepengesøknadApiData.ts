import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { ISODateString } from 'nav-datovelger/lib/types';
import { AndreYtelserFraNAV, ArbeidsforholdType, Arbeidsform, BarnRelasjon, JobberSvar, VetOmsorgstilbud } from './';

export type ISO8601Duration = string;

export interface BarnetSøknadenGjelderApiData {
    navn: string | null;
    fødselsnummer: string | null;
    fødselsdato: string | null;
    aktørId: string | null;
    sammeAdresse: boolean | null;
}

export interface ArbeidIPeriodeApiData {
    jobber: JobberSvar;
    jobberSomVanlig: boolean;
    enkeltdager?: TidEnkeltdagApiData[];
    fasteDager?: TidFasteDagerApiData;
}

export interface ArbeidsforholdApiData {
    _type: ArbeidsforholdType;
    arbeidsform: Arbeidsform;
    jobberNormaltTimer: number;
    erAktivt?: boolean;
    historiskArbeid?: ArbeidIPeriodeApiData;
    planlagtArbeid?: ArbeidIPeriodeApiData;
}

export interface ArbeidsforholdAnsattApiData extends ArbeidsforholdApiData {
    _type: ArbeidsforholdType.ANSATT;
    navn: string;
    organisasjonsnummer?: string;
}

export const isArbeidsforholdAnsattApiData = (forhold: any): forhold is ArbeidsforholdAnsattApiData => {
    return forhold?._type === ArbeidsforholdType.ANSATT;
};
export interface FrilansApiData {
    startdato: ApiStringDate;
    jobberFortsattSomFrilans: boolean;
    sluttdato?: ApiStringDate;
    arbeidsforhold: ArbeidsforholdApiData;
}

export interface SelvstendigNæringsdrivendeApiData {
    virksomhet: VirksomhetApiData;
    arbeidsforhold: ArbeidsforholdApiData;
}

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

export interface FerieuttakIPeriodenApiData {
    skalTaUtFerieIPerioden: boolean;
    ferieuttak: FerieuttakIPeriodeApiData[];
}

export interface PleiepengesøknadApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    barn: BarnetSøknadenGjelderApiData;
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
    ferieuttakIPerioden?: FerieuttakIPeriodenApiData;
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
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    harVærtEllerErVernepliktig?: boolean;
    andreYtelserFraNAV?: AndreYtelserFraNAV[];
}
