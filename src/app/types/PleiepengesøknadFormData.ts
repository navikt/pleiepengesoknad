import { Arbeidsgiver } from './Søkerdata';
import { YesOrNo } from 'common/types/YesOrNo';
import { Time } from 'common/types/Time';
import { Attachment } from 'common/types/Attachment';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
// import { } from 'app/config/'
export enum ArbeidsforholdSkalJobbeSvar {
    'ja' = 'ja',
    'nei' = 'nei',
    'redusert' = 'redusert',
    'vetIkke' = 'vetIkke'
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
    søkersRelasjonTilBarnet = 'søkersRelasjonTilBarnet',
    søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    legeerklæring = 'legeerklæring',
    arbeidsforhold = 'arbeidsforhold',
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    utenlandsoppholdSiste12Mnd = 'utenlandsoppholdSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
    utenlandsoppholdNeste12Mnd = 'utenlandsoppholdNeste12Mnd',
    skalOppholdsSegIUtlandetIPerioden = 'skalOppholdeSegIUtlandetIPerioden',
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
    tilsynsordning__vetIkke__ekstrainfo = 'tilsynsordning.vetIkke.ekstrainfo'
}

export enum ArbeidsforholdField {
    erAnsattIPerioden = 'erAnsattIPerioden',
    skalJobbe = 'skalJobbe',
    timerEllerProsent = 'timerEllerProsent',
    jobberNormaltTimer = 'jobberNormaltTimer',
    skalJobbeTimer = 'skalJobbeTimer',
    skalJobbeProsent = 'skalJobbeProsent'
}

export interface Arbeidsforhold extends Arbeidsgiver {
    [ArbeidsforholdField.erAnsattIPerioden]?: YesOrNo;
    [ArbeidsforholdField.skalJobbe]?: ArbeidsforholdSkalJobbeSvar;
    [ArbeidsforholdField.timerEllerProsent]?: 'timer' | 'prosent';
    [ArbeidsforholdField.jobberNormaltTimer]?: number;
    [ArbeidsforholdField.skalJobbeTimer]?: number;
    [ArbeidsforholdField.skalJobbeProsent]?: number;
}

export enum TilsynVetIkkeHvorfor {
    'er_sporadisk' = 'er_sporadisk',
    'er_ikke_laget_en_plan' = 'er_ikke_laget_en_plan',
    'annet' = 'annet'
}

export interface PleiepengesøknadFormData {
    [AppFormField.harForståttRettigheterOgPlikter]: boolean;
    [AppFormField.harBekreftetOpplysninger]: boolean;
    [AppFormField.barnetsNavn]: string;
    [AppFormField.barnetsFødselsnummer]: string;
    [AppFormField.søkersRelasjonTilBarnet]: string;
    [AppFormField.barnetsFødselsdato]?: Date;
    [AppFormField.søknadenGjelderEtAnnetBarn]: boolean;
    [AppFormField.barnetSøknadenGjelder]: string;
    [AppFormField.barnetHarIkkeFåttFødselsnummerEnda]: boolean;
    [AppFormField.arbeidsforhold]: Arbeidsforhold[];
    [AppFormField.periodeFra]?: Date;
    [AppFormField.periodeTil]?: Date;
    [AppFormField.legeerklæring]: Attachment[];
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [AppFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [AppFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
    [AppFormField.skalOppholdsSegIUtlandetIPerioden]: YesOrNo;
    [AppFormField.utenlandsoppholdIPerioden]: Utenlandsopphold[];
    [AppFormField.harMedsøker]: YesOrNo;
    [AppFormField.samtidigHjemme]: YesOrNo;
    [AppFormField.tilsynsordning]?: Tilsynsordning;
    [AppFormField.harNattevåk]: YesOrNo;
    [AppFormField.harNattevåk_ekstrainfo]?: string;
    [AppFormField.harBeredskap]: YesOrNo;
    [AppFormField.harBeredskap_ekstrainfo]?: string;
}

export const initialValues: PleiepengesøknadFormData = {
    [AppFormField.periodeFra]: undefined,
    [AppFormField.periodeTil]: undefined,
    [AppFormField.barnetsNavn]: '',
    [AppFormField.barnetsFødselsnummer]: '',
    [AppFormField.barnetSøknadenGjelder]: '',
    [AppFormField.harForståttRettigheterOgPlikter]: false,
    [AppFormField.harBekreftetOpplysninger]: false,
    [AppFormField.søkersRelasjonTilBarnet]: '',
    [AppFormField.søknadenGjelderEtAnnetBarn]: false,
    [AppFormField.legeerklæring]: [],
    [AppFormField.arbeidsforhold]: [],
    [AppFormField.barnetHarIkkeFåttFødselsnummerEnda]: false,
    [AppFormField.barnetsFødselsdato]: undefined,
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [AppFormField.utenlandsoppholdSiste12Mnd]: [],
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [AppFormField.utenlandsoppholdNeste12Mnd]: [],
    [AppFormField.skalOppholdsSegIUtlandetIPerioden]: YesOrNo.UNANSWERED,
    [AppFormField.utenlandsoppholdIPerioden]: [],
    [AppFormField.harMedsøker]: YesOrNo.UNANSWERED,
    [AppFormField.samtidigHjemme]: YesOrNo.UNANSWERED,
    [AppFormField.tilsynsordning]: undefined,
    [AppFormField.harNattevåk]: YesOrNo.UNANSWERED,
    [AppFormField.harBeredskap]: YesOrNo.UNANSWERED
};
