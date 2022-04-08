import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { ISODate, ISODuration } from '@navikt/sif-common-utils';
import { AndreYtelserFraNAV, BarnRelasjon, ÅrsakManglerIdentitetsnummer } from '..';
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

export interface OmsorgstilbudApiData {
    erLiktHverUke: boolean;
    enkeltdager?: TidEnkeltdagApiData[];
    ukedager?: TimerFasteDagerApiData;
}

export interface BarnetSøknadenGjelderApiData {
    navn: string | null;
    fødselsnummer: string | null;
    fødselsdato: string | null;
    aktørId: string | null;
    sammeAdresse: boolean | null;
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

export interface SøknadApiData {
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
    medlemskap: MedlemskapApiData;
    utenlandsoppholdIPerioden?: {
        skalOppholdeSegIUtlandetIPerioden: boolean;
        opphold: UtenlandsoppholdIPeriodenApiData[];
    };
    ferieuttakIPerioden?: FerieuttakIPeriodenApiData;
    omsorgstilbud?: OmsorgstilbudApiData;
    nattevåk?: {
        harNattevåk: boolean;
        tilleggsinformasjon?: string;
    };
    beredskap?: {
        beredskap: boolean;
        tilleggsinformasjon?: string;
    };
    arbeidsgivere: ArbeidsgiverApiData[];
    frilans: FrilansApiData;
    selvstendigNæringsdrivende: SelvstendigApiData;
    harVærtEllerErVernepliktig?: boolean;
    andreYtelserFraNAV?: AndreYtelserFraNAV[];
    /** Alle felter med _ brukes ikke i mottak, kun for å vise i oppsummering */
    _barnetHarIkkeFnr?: boolean;
}
