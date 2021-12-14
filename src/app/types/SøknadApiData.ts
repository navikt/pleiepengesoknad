import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { AndreYtelserFraNAV, ArbeidsforholdType, BarnRelasjon, ISODate, JobberIPeriodeSvar } from './';

export type ISO8601Duration = string;

export interface BarnetSøknadenGjelderApiData {
    navn: string | null;
    fødselsnummer: string | null;
    fødselsdato: string | null;
    aktørId: string | null;
    sammeAdresse: boolean | null;
}

export interface ArbeidIPeriodeApiData {
    jobberIPerioden: JobberIPeriodeSvar;
    jobberSomVanlig?: boolean; // TODO - skal tas bort, men er med nå frem til api er oppdatert
    erLiktHverUke?: boolean;
    enkeltdager?: TidEnkeltdagApiData[];
    fasteDager?: TidFasteDagerApiData;
    jobberProsent?: number;
}

export interface ArbeidsforholdApiData {
    _type: ArbeidsforholdType;
    jobberNormaltTimer: number;
    historiskArbeid?: ArbeidIPeriodeApiData;
    planlagtArbeid?: ArbeidIPeriodeApiData;
}

export type ArbeidsgiverApiData = ArbeidsgiverISøknadsperiodeApiData | ArbeidsgiverUtenforSøknadsperiodeApiData;

export interface ArbeidsgiverUtenforSøknadsperiodeApiData {
    navn: string;
    organisasjonsnummer?: string;
    erAnsatt: false;
    sluttetFørSøknadsperiode: true;
}
export interface ArbeidsgiverISøknadsperiodeApiData {
    navn: string;
    organisasjonsnummer?: string;
    erAnsatt: boolean;
    sluttetFørSøknadsperiode?: false;
    arbeidsforhold: ArbeidsforholdApiData;
}

export const isArbeidsgiverISøknadsperiodeApiData = (
    arbeidsgiver: any
): arbeidsgiver is ArbeidsgiverISøknadsperiodeApiData => {
    return (
        arbeidsgiver.erAnsatt === true ||
        (arbeidsgiver.erAnsatt === false && arbeidsgiver.sluttetFørSøknadsperiode === false)
    );
};

export const isArbeidsforholdAnsattApiData = (forhold: any): forhold is ArbeidsgiverApiData => {
    return forhold?._type === ArbeidsforholdType.ANSATT;
};
export interface FrilansApiData {
    startdato: ApiStringDate;
    jobberFortsattSomFrilans: boolean;
    sluttdato?: ApiStringDate;
    arbeidsforhold?: ArbeidsforholdApiData;
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
    dato: ISODate;
    tid: ISO8601Duration;
}

export interface PlanlagtOmsorgstilbudApiData {
    erLiktHverUke: boolean;
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

export interface SøknadApiData {
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    barn: BarnetSøknadenGjelderApiData;
    barnRelasjon?: BarnRelasjon;
    barnRelasjonBeskrivelse?: string;
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
    vedlegg: string[];
    medlemskap: MedlemskapApiData;
    utenlandsoppholdIPerioden?: {
        skalOppholdeSegIUtlandetIPerioden: boolean;
        opphold: UtenlandsoppholdIPeriodenApiData[];
    };
    ferieuttakIPerioden?: FerieuttakIPeriodenApiData;
    harMedsøker: boolean;
    samtidigHjemme?: boolean;
    omsorgstilbud?: OmsorgstilbudApiData;
    nattevåk?: {
        harNattevåk: boolean;
        tilleggsinformasjon?: string;
    };
    beredskap?: {
        beredskap: boolean;
        tilleggsinformasjon?: string;
    };
    arbeidsgivere?: ArbeidsgiverApiData[];
    _harHattInntektSomFrilanser: boolean;
    frilans?: FrilansApiData;
    _harHattInntektSomSelvstendigNæringsdrivende: boolean;
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    harVærtEllerErVernepliktig?: boolean;
    andreYtelserFraNAV?: AndreYtelserFraNAV[];
}
