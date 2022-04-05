import { ApiStringDate } from '@navikt/sif-common-core/lib/types/ApiStringDate';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { ISODate, ISODuration } from '@navikt/sif-common-utils';
import { AndreYtelserFraNAV, BarnRelasjon, ÅrsakManglerIdentitetsnummer } from './';
import { ArbeidsgiverType } from './Arbeidsgiver';

export interface PeriodeApiData {
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
}

export interface TimerFasteDagerApiData {
    mandag?: ISODuration;
    tirsdag?: ISODuration;
    onsdag?: ISODuration;
    torsdag?: ISODuration;
    fredag?: ISODuration;
}
// export interface ArbeidstimerFasteDagerApiData {
//     mandag?: ArbeidstimerApiData;
//     tirsdag?: ArbeidstimerApiData;
//     onsdag?: ArbeidstimerApiData;
//     torsdag?: ArbeidstimerApiData;
//     fredag?: ArbeidstimerApiData;
// }
export interface TidEnkeltdagApiData {
    dato: ISODate;
    tid: ISODuration;
}

export interface ArbeidstidEnkeltdagApiData {
    dato: ISODate;
    arbeidstimer: ArbeidstimerApiData;
}

export interface ArbeidstimerApiData {
    normalTimer: ISODuration;
    faktiskTimer: ISODuration;
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

export interface ArbeidIPeriodeApiDataJobberIkke {
    type: 'jobberIkkeIPerioden';
    jobberIPerioden: 'NEI';
}
export interface ArbeidIPeriodeApiDataFasteDager {
    type: 'jobberFasteDager';
    jobberIPerioden: 'JA';
    erLiktHverUke: true;
    fasteDager: TimerFasteDagerApiData;
}

export interface ArbeidIPeriodeApiDataProsent {
    type: 'jobberProsent';
    jobberIPerioden: 'JA';
    erLiktHverUke: true;
    jobberProsent: number;
    fasteDager: TimerFasteDagerApiData;
}

export interface ArbeidIPeriodeApiDataTimerPerUke {
    type: 'jobberTimerPerUke';
    jobberIPerioden: 'JA';
    erLiktHverUke: true;
    jobberTimer: number;
    fasteDager: TimerFasteDagerApiData;
}

export interface ArbeidIPeriodeApiDataVariert {
    type: 'jobberVariert';
    jobberIPerioden: 'JA';
    erLiktHverUke: false;
    enkeltdager: ArbeidstidEnkeltdagApiData[];
}

export type ArbeidIPeriodeApiData =
    | ArbeidIPeriodeApiDataJobberIkke
    | ArbeidIPeriodeApiDataFasteDager
    | ArbeidIPeriodeApiDataProsent
    | ArbeidIPeriodeApiDataTimerPerUke
    | ArbeidIPeriodeApiDataVariert;

type NormalarbeidstidPerUkeApiData = {
    erLiktHverUke: false;
    timerPerUke: number;
    timerFasteDager: TimerFasteDagerApiData;
};
type NormalarbeidstidFasteDagerApiData = {
    erLiktHverUke: true;
    timerPerUke: number;
    timerFasteDager: TimerFasteDagerApiData;
};

export type NormalarbeidstidApiData = NormalarbeidstidPerUkeApiData | NormalarbeidstidFasteDagerApiData;

export interface ArbeidsforholdApiData {
    harFraværIPeriode: boolean;
    normalarbeidstid: NormalarbeidstidApiData;
    arbeidIPeriode?: ArbeidIPeriodeApiData;
}
export interface ArbeidsgiverApiData {
    type: ArbeidsgiverType;
    navn: string;
    organisasjonsnummer?: string;
    offentligIdent?: string;
    ansattFom?: ApiStringDate;
    ansattTom?: ApiStringDate;
    erAnsatt: boolean;
    sluttetFørSøknadsperiode?: boolean;
    arbeidsforhold?: ArbeidsforholdApiData;
}

export interface FrilansApiDataIngenInntekt {
    harInntektSomFrilanser: false;
}
export interface FrilansApiDataSluttetFørSøknadsperiode {
    harInntektSomFrilanser: false;
    startdato: ApiStringDate;
    jobberFortsattSomFrilans: false;
    sluttdato?: ApiStringDate;
}
export interface FrilansApiDataHarInntekt {
    harInntektSomFrilanser: true;
    startdato: ApiStringDate;
    jobberFortsattSomFrilans: boolean;
    sluttdato?: ApiStringDate;
    arbeidsforhold: ArbeidsforholdApiData;
}
export type FrilansApiData =
    | FrilansApiDataIngenInntekt
    | FrilansApiDataSluttetFørSøknadsperiode
    | FrilansApiDataHarInntekt;

export interface SelvstendigApiDataIngenInntekt {
    harInntektSomSelvstendig: false;
}
export interface SelvstendigApiDataHarInntekt {
    harInntektSomSelvstendig: true;
    virksomhet: VirksomhetApiData;
    arbeidsforhold: ArbeidsforholdApiData;
}

export type SelvstendigApiData = SelvstendigApiDataHarInntekt | SelvstendigApiDataIngenInntekt;

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
    fraOgMed: ApiStringDate;
    tilOgMed: ApiStringDate;
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
