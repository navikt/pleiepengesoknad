import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { ISODate, ISODuration } from '@navikt/sif-common-utils';
import { AndreYtelserFraNAV, BarnRelasjon, JobberIPeriodeSvar, ÅrsakManglerIdentitetsnummer } from './';

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
    mandag?: ISODuration;
    tirsdag?: ISODuration;
    onsdag?: ISODuration;
    torsdag?: ISODuration;
    fredag?: ISODuration;
}
export interface TidEnkeltdagApiData {
    dato: ISODate;
    tid: ISODuration;
}

export interface PlanlagtOmsorgstilbudApiData {
    erLiktHverUke: boolean;
    enkeltdager?: TidEnkeltdagApiData[];
    ukedager?: TidFasteDagerApiData;
}

export interface HistoriskOmsorgstilbudApiData {
    erLiktHverUke: boolean;
    enkeltdager?: TidEnkeltdagApiData[];
    ukedager?: TidFasteDagerApiData;
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
    årsakManglerIdentitetsnummer?: ÅrsakManglerIdentitetsnummer;
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
    frilans?: FrilansApiData;
    selvstendigNæringsdrivende?: SelvstendigNæringsdrivendeApiData;
    harVærtEllerErVernepliktig?: boolean;
    andreYtelserFraNAV?: AndreYtelserFraNAV[];
    _barnetHarIkkeFnr?: boolean;
    _harHattInntektSomFrilanser: boolean;
    _harHattInntektSomSelvstendigNæringsdrivende: boolean;
}
