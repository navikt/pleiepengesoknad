import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Arbeidsgiver } from './Søkerdata';

export enum ArbeidsforholdSkalJobbeSvar {
    'ja' = 'ja',
    'nei' = 'nei',
    'redusert' = 'redusert',
    'vetIkke' = 'vetIkke',
}

export interface Tilsynsuke {
    mandag?: Time;
    tirsdag?: Time;
    onsdag?: Time;
    torsdag?: Time;
    fredag?: Time;
}

export interface Tilsynsordning {
    skalBarnHaTilsyn: YesOrNo;
    ja?: {
        tilsyn?: Tilsynsuke;
        harEkstrainfo?: YesOrNo;
        ekstrainfo: string;
    };
    vetIkke?: {
        hvorfor: TilsynVetIkkeHvorfor;
        ekstrainfo: string;
    };
}

export enum AppFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    barnetHarIkkeFåttFødselsnummerEnda = 'barnetHarIkkeFåttFødselsnummerEnda',
    barnetsNavn = 'barnetsNavn',
    barnetsFødselsnummer = 'barnetsFødselsnummer',
    barnetsFødselsdato = 'barnetsFødselsdato',
    barnetSøknadenGjelder = 'barnetSøknadenGjelder',
    relasjonTilBarnet = 'relasjonTilBarnet',
    relasjonTilBarnetBeskrivelse = 'relasjonTilBarnetBeskrivelse',
    søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    bekrefterPeriodeOver8uker = 'bekrefterPeriodeOver8uker',
    skalPassePåBarnetIHelePerioden = 'skalPassePåBarnetIHelePerioden',
    beskrivelseOmsorgsrolleIPerioden = 'beskrivelseOmsorgsrolleIPerioden',
    legeerklæring = 'legeerklæring',
    arbeidsforhold = 'arbeidsforhold',
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd',
    skalOppholdeSegIUtlandetIPerioden = 'skalOppholdeSegIUtlandetIPerioden',
    skalTaUtFerieIPerioden = 'skalTaUtFerieIPerioden',
    ferieuttakIPerioden = 'ferieuttakIPerioden',
    utenlandsoppholdIPerioden = 'utenlandsoppholdIPerioden',
    harMedsøker = 'harMedsøker',
    samtidigHjemme = 'samtidigHjemme',
    harNattevåk = 'harNattevåk',
    harNattevåk_ekstrainfo = 'harNattevåk_ekstrainfo',
    harBeredskap = 'harBeredskap',
    harBeredskap_ekstrainfo = 'harBeredskap_ekstrainfo',
    tilsynsordning = 'tilsynsordning',
    tilsynsordning__skalBarnHaTilsyn = 'tilsynsordning.skalBarnHaTilsyn',
    tilsynsordning__ja__tilsyn = 'tilsynsordning.ja.tilsyn',
    tilsynsordning__ja__ekstrainfo = 'tilsynsordning.ja.ekstrainfo',
    tilsynsordning__vetIkke__hvorfor = 'tilsynsordning.vetIkke.hvorfor',
    tilsynsordning__vetIkke__ekstrainfo = 'tilsynsordning.vetIkke.ekstrainfo',
    frilans_harHattInntektSomFrilanser = 'harHattInntektSomFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    selvstendig_harHattInntektSomSN = 'selvstendig_harHattInntektSomSN',
    selvstendig_virksomheter = 'selvstendig_virksomheter',
    harVærtEllerErVernepliktig = 'harVærtEllerErVernepliktig',
    mottarAndreYtelser = 'mottarAndreYtelser',
    andreYtelser = 'andreYtelser',
}

export enum ArbeidsforholdField {
    erAnsattIPerioden = 'erAnsattIPerioden',
    skalJobbe = 'skalJobbe',
    timerEllerProsent = 'timerEllerProsent',
    jobberNormaltTimer = 'jobberNormaltTimer',
    skalJobbeTimer = 'skalJobbeTimer',
    skalJobbeProsent = 'skalJobbeProsent',
    arbeidsform = 'arbeidsform',
}

export enum Arbeidsform {
    fast = 'FAST',
    turnus = 'TURNUS',
    varierende = 'VARIERENDE',
}

export enum AndreYtelserFraNAV {
    'dagpenger' = 'dagpenger',
    'foreldrepenger' = 'foreldrepenger',
    'svangerskapspenger' = 'svangerskapspenger',
    'sykepenger' = 'sykepenger',
    'omsorgspenger' = 'omsorgspenger',
    'opplæringspenger' = 'opplæringspenger',
}

export interface Arbeidsforhold extends Arbeidsgiver {
    [ArbeidsforholdField.erAnsattIPerioden]?: YesOrNo;
    [ArbeidsforholdField.jobberNormaltTimer]?: number;
    [ArbeidsforholdField.skalJobbe]?: ArbeidsforholdSkalJobbeSvar;
    [ArbeidsforholdField.timerEllerProsent]?: 'timer' | 'prosent';
    [ArbeidsforholdField.skalJobbeTimer]?: number;
    [ArbeidsforholdField.skalJobbeProsent]?: number;
    [ArbeidsforholdField.arbeidsform]?: Arbeidsform;
}

export enum TilsynVetIkkeHvorfor {
    'erSporadisk' = 'erSporadisk',
    'erIkkeLagetEnPlan' = 'erIkkeLagetEnPlan',
    'annet' = 'annet',
}

export enum BarnRelasjon {
    MOR = 'MOR',
    MEDMOR = 'MEDMOR',
    FAR = 'FAR',
    ANNET = 'ANNET',
}

export interface PleiepengesøknadFormData {
    [AppFormField.harForståttRettigheterOgPlikter]: boolean;
    [AppFormField.harBekreftetOpplysninger]: boolean;
    [AppFormField.barnetsNavn]: string;
    [AppFormField.barnetsFødselsnummer]: string;
    [AppFormField.barnetsFødselsdato]?: string;
    [AppFormField.søknadenGjelderEtAnnetBarn]: boolean;
    [AppFormField.barnetSøknadenGjelder]: string;
    [AppFormField.barnetHarIkkeFåttFødselsnummerEnda]: boolean;
    [AppFormField.relasjonTilBarnet]?: BarnRelasjon;
    [AppFormField.relasjonTilBarnetBeskrivelse]?: string;
    [AppFormField.arbeidsforhold]: Arbeidsforhold[];
    [AppFormField.periodeFra]?: string;
    [AppFormField.periodeTil]?: string;
    [AppFormField.bekrefterPeriodeOver8uker]?: YesOrNo;
    [AppFormField.skalPassePåBarnetIHelePerioden]?: YesOrNo;
    [AppFormField.beskrivelseOmsorgsrolleIPerioden]?: string;
    [AppFormField.legeerklæring]: Attachment[];
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [AppFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [AppFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
    [AppFormField.skalOppholdeSegIUtlandetIPerioden]?: YesOrNo;
    [AppFormField.utenlandsoppholdIPerioden]?: Utenlandsopphold[];
    [AppFormField.skalTaUtFerieIPerioden]?: YesOrNo;
    [AppFormField.ferieuttakIPerioden]?: Ferieuttak[];
    [AppFormField.harMedsøker]: YesOrNo;
    [AppFormField.samtidigHjemme]: YesOrNo;
    [AppFormField.tilsynsordning]?: Tilsynsordning;
    [AppFormField.harNattevåk]: YesOrNo;
    [AppFormField.harNattevåk_ekstrainfo]?: string;
    [AppFormField.harBeredskap]: YesOrNo;
    [AppFormField.harBeredskap_ekstrainfo]?: string;
    [AppFormField.frilans_harHattInntektSomFrilanser]?: YesOrNo;
    [AppFormField.frilans_startdato]?: string;
    [AppFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [AppFormField.selvstendig_harHattInntektSomSN]?: YesOrNo;
    [AppFormField.selvstendig_virksomheter]?: Virksomhet[];
    [AppFormField.harVærtEllerErVernepliktig]?: YesOrNo;
    [AppFormField.mottarAndreYtelser]?: YesOrNo;
    [AppFormField.andreYtelser]?: AndreYtelserFraNAV[];
}

export const initialValues: PleiepengesøknadFormData = {
    [AppFormField.periodeFra]: undefined,
    [AppFormField.periodeTil]: undefined,
    [AppFormField.bekrefterPeriodeOver8uker]: undefined,
    [AppFormField.barnetsNavn]: '',
    [AppFormField.barnetsFødselsnummer]: '',
    [AppFormField.barnetSøknadenGjelder]: '',
    [AppFormField.harForståttRettigheterOgPlikter]: false,
    [AppFormField.harBekreftetOpplysninger]: false,
    [AppFormField.søknadenGjelderEtAnnetBarn]: false,
    [AppFormField.legeerklæring]: [],
    [AppFormField.arbeidsforhold]: [],
    [AppFormField.barnetHarIkkeFåttFødselsnummerEnda]: false,
    [AppFormField.barnetsFødselsdato]: undefined,
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [AppFormField.utenlandsoppholdSiste12Mnd]: [],
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [AppFormField.utenlandsoppholdNeste12Mnd]: [],
    [AppFormField.skalOppholdeSegIUtlandetIPerioden]: YesOrNo.UNANSWERED,
    [AppFormField.utenlandsoppholdIPerioden]: [],
    [AppFormField.skalTaUtFerieIPerioden]: YesOrNo.UNANSWERED,
    [AppFormField.ferieuttakIPerioden]: [],
    [AppFormField.harMedsøker]: YesOrNo.UNANSWERED,
    [AppFormField.samtidigHjemme]: YesOrNo.UNANSWERED,
    [AppFormField.tilsynsordning]: undefined,
    [AppFormField.harNattevåk]: YesOrNo.UNANSWERED,
    [AppFormField.harBeredskap]: YesOrNo.UNANSWERED,
    [AppFormField.frilans_harHattInntektSomFrilanser]: YesOrNo.UNANSWERED,
    [AppFormField.selvstendig_harHattInntektSomSN]: YesOrNo.UNANSWERED,
    [AppFormField.selvstendig_virksomheter]: [],
    [AppFormField.andreYtelser]: [],
};
