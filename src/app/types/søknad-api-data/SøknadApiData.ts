import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { OpptjeningAktivitet } from '@navikt/sif-common-forms/lib/opptjening-utland';
import { UtenlandskNæringstype } from '@navikt/sif-common-forms/lib/utenlandsk-næring';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { ISODate, ISODuration } from '@navikt/sif-common-utils';
import { BarnRelasjon, ÅrsakManglerIdentitetsnummer } from '..';
import { ArbeidsgiverApiData } from './arbeidsgiverApiData';
import { FrilansApiData } from './frilansApiData';
import { SelvstendigApiData } from './selvstendigApiData';

export * from './arbeidIPeriodeApiData';
export * from './arbeidsgiverApiData';
export * from './normalarbeidstidApiData';
export * from './arbeidsforholdApiData';
export * from './selvstendigApiData';
export * from './frilansApiData';

export interface PeriodeApiData {
    fraOgMed: ISODate;
    tilOgMed: ISODate;
}

export interface TimerFasteDagerApiData {
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

export enum OmsorgstilbudSvarApi {
    JA = 'JA',
    NEI = 'NEI',
    USIKKER = 'USIKKER',
}
export interface OmsorgstilbudApiData {
    erLiktHverUke?: boolean;
    svarFortid?: OmsorgstilbudSvarApi;
    svarFremtid?: OmsorgstilbudSvarApi;
    enkeltdager?: TidEnkeltdagApiData[];
    ukedager?: TimerFasteDagerApiData;
}

export interface BarnetSøknadenGjelderApiData {
    navn?: string;
    fødselsnummer?: string;
    fødselsdato?: string;
    aktørId?: string;
    sammeAdresse?: boolean;
    årsakManglerIdentitetsnummer?: ÅrsakManglerIdentitetsnummer;
}

export interface MedlemskapApiData {
    harBoddIUtlandetSiste12Mnd: boolean;
    skalBoIUtlandetNeste12Mnd: boolean;
    utenlandsoppholdNeste12Mnd: BostedUtlandApiData[];
    utenlandsoppholdSiste12Mnd: BostedUtlandApiData[];
}

export interface BostedUtlandApiData extends PeriodeApiData {
    landkode: string;
    landnavn: string;
}

export interface UtenlandsoppholdIPeriodenApiData extends PeriodeApiData {
    landkode: string;
    landnavn: string;
}

export interface UtenlandsoppholdUtenforEøsIPeriodenApiData extends UtenlandsoppholdIPeriodenApiData {
    erBarnetInnlagt: boolean;
    erUtenforEøs: boolean;
    perioderBarnetErInnlagt: PeriodeApiData[];
    årsak: UtenlandsoppholdÅrsak | null;
}

export function isUtenlandsoppholdUtenforEØSApiData(
    opphold: UtenlandsoppholdIPeriodenApiData
): opphold is UtenlandsoppholdUtenforEøsIPeriodenApiData {
    return Object.keys(opphold).includes('erBarnetInnlagt');
}

export interface FerieuttakIPeriodenApiData {
    skalTaUtFerieIPerioden: boolean;
    ferieuttak: PeriodeApiData[];
}

export interface LandApi {
    landkode: string;
    landnavn: string;
}

export interface OpptjeningIUtlandetApiData {
    navn: string;
    opptjeningType: OpptjeningAktivitet;
    land: LandApi;
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
}

export interface UtenlandskNæringApiData {
    næringstype: UtenlandskNæringstype;
    navnPåVirksomheten: string;
    land: LandApi;
    organisasjonsnummer?: string;
    fraOgMed: ApiStringDate;
    tilOgMed?: ApiStringDate;
}

export type UtenlandsoppholdIPeriodenSøknadApiData = {
    skalOppholdeSegIUtlandetIPerioden: boolean;
    opphold: UtenlandsoppholdIPeriodenApiData[];
};

export interface NattevåkApiData {
    harNattevåk: boolean;
    tilleggsinformasjon?: string;
}

export interface BeredskapApiData {
    beredskap: boolean;
    tilleggsinformasjon?: string;
}
export interface SøknadApiData {
    versjon: string;
    språk: Locale;
    harForståttRettigheterOgPlikter: boolean;
    harBekreftetOpplysninger: boolean;
    fraOgMed: ISODate;
    tilOgMed: ISODate;
    barn: BarnetSøknadenGjelderApiData;
    barnRelasjon?: BarnRelasjon;
    barnRelasjonBeskrivelse?: string;
    harMedsøker: boolean;
    samtidigHjemme?: boolean;
    vedlegg: string[];
    fødselsattestVedleggUrls: string[];
    medlemskap: MedlemskapApiData;
    utenlandsoppholdIPerioden?: UtenlandsoppholdIPeriodenSøknadApiData;
    ferieuttakIPerioden?: FerieuttakIPeriodenApiData;
    omsorgstilbud?: OmsorgstilbudApiData;
    nattevåk?: NattevåkApiData;
    beredskap?: BeredskapApiData;
    arbeidsgivere: ArbeidsgiverApiData[];
    frilans: FrilansApiData;
    selvstendigNæringsdrivende: SelvstendigApiData;
    harVærtEllerErVernepliktig?: boolean;
    opptjeningIUtlandet: OpptjeningIUtlandetApiData[];
    utenlandskNæring: UtenlandskNæringApiData[];
    /** Alle felter med _ brukes ikke i mottak, kun for å vise i oppsummering */
    _barnetHarIkkeFnr?: boolean;
}
