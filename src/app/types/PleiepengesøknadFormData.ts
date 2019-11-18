import { Ansettelsesforhold } from './Søkerdata';
import { YesOrNo } from './YesOrNo';
import { Time } from './Time';

export enum AnsettelsesforholdSkalJobbeSvar {
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

export enum Field {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    barnetHarIkkeFåttFødselsnummerEnda = 'barnetHarIkkeFåttFødselsnummerEnda',
    barnetsNavn = 'barnetsNavn',
    barnetsFødselsnummer = 'barnetsFødselsnummer',
    barnetsForeløpigeFødselsnummerEllerDNummer = 'barnetsForeløpigeFødselsnummerEllerDNummer',
    barnetSøknadenGjelder = 'barnetSøknadenGjelder',
    søkersRelasjonTilBarnet = 'søkersRelasjonTilBarnet',
    søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    legeerklæring = 'legeerklæring',
    ansettelsesforhold = 'ansettelsesforhold',
    harBoddUtenforNorgeSiste12Mnd = 'harBoddUtenforNorgeSiste12Mnd',
    skalBoUtenforNorgeNeste12Mnd = 'skalBoUtenforNorgeNeste12Mnd',
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

export enum AnsettelsesforholdField {
    skalJobbe = 'skalJobbe',
    timerEllerProsent = 'timerEllerProsent',
    jobberNormaltTimer = 'jobberNormaltTimer',
    vetIkkeEkstrainfo = 'vetIkkeEkstrainfo',
    skalJobbeTimer = 'skalJobbeTimer',
    skalJobbeProsent = 'skalJobbeProsent'
}

export interface AnsettelsesforholdForm extends Ansettelsesforhold {
    [AnsettelsesforholdField.skalJobbe]?: AnsettelsesforholdSkalJobbeSvar;
    [AnsettelsesforholdField.timerEllerProsent]?: 'timer' | 'prosent';
    [AnsettelsesforholdField.jobberNormaltTimer]?: number;
    [AnsettelsesforholdField.vetIkkeEkstrainfo]?: string;
    [AnsettelsesforholdField.skalJobbeTimer]?: number;
    [AnsettelsesforholdField.skalJobbeProsent]?: number;
}

export enum TilsynVetIkkeHvorfor {
    'er_sporadisk' = 'er_sporadisk',
    'er_ikke_laget_en_plan' = 'er_ikke_laget_en_plan',
    'annet' = 'annet'
}

export interface PleiepengesøknadFormData {
    [Field.harForståttRettigheterOgPlikter]: boolean;
    [Field.harBekreftetOpplysninger]: boolean;
    [Field.barnetsNavn]: string;
    [Field.barnetsFødselsnummer]: string;
    [Field.søkersRelasjonTilBarnet]: string;
    [Field.søknadenGjelderEtAnnetBarn]: boolean;
    [Field.barnetSøknadenGjelder]: string;
    [Field.ansettelsesforhold]: AnsettelsesforholdForm[];
    [Field.periodeFra]?: Date;
    [Field.periodeTil]?: Date;
    [Field.legeerklæring]: Attachment[];
    [Field.barnetHarIkkeFåttFødselsnummerEnda]: boolean;
    [Field.barnetsForeløpigeFødselsnummerEllerDNummer]: string;
    [Field.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [Field.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [Field.harMedsøker]: YesOrNo;
    [Field.samtidigHjemme]: YesOrNo;
    [Field.tilsynsordning]?: Tilsynsordning;
    [Field.harNattevåk]: YesOrNo;
    [Field.harNattevåk_ekstrainfo]?: string;
    [Field.harBeredskap]: YesOrNo;
    [Field.harBeredskap_ekstrainfo]?: string;
}

export const initialValues: PleiepengesøknadFormData = {
    [Field.barnetsNavn]: '',
    [Field.barnetsFødselsnummer]: '',
    [Field.barnetSøknadenGjelder]: '',
    [Field.harForståttRettigheterOgPlikter]: false,
    [Field.harBekreftetOpplysninger]: false,
    [Field.søkersRelasjonTilBarnet]: '',
    [Field.søknadenGjelderEtAnnetBarn]: false,
    [Field.legeerklæring]: [],
    [Field.ansettelsesforhold]: [],
    [Field.barnetHarIkkeFåttFødselsnummerEnda]: false,
    [Field.barnetsForeløpigeFødselsnummerEllerDNummer]: '',
    [Field.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [Field.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [Field.harMedsøker]: YesOrNo.UNANSWERED,
    [Field.samtidigHjemme]: YesOrNo.UNANSWERED,
    [Field.tilsynsordning]: undefined,
    [Field.harNattevåk]: YesOrNo.UNANSWERED,
    [Field.harBeredskap]: YesOrNo.UNANSWERED
};
