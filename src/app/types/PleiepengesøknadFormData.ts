import { Ansettelsesforhold } from './Søkerdata';
import { YesOrNo } from './YesOrNo';

export interface AnsettelsesforholdForm extends Ansettelsesforhold {
    redusert_arbeidsprosent?: number;
}
export enum AnsettelsesforholdField {
    'redusert_arbeidsprosent' = 'redusert_arbeidsprosent'
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
    grad = 'grad',
    dagerPerUkeBorteFraJobb = 'dagerPerUkeBorteFraJobb'
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
    [Field.grad]: number;
    [Field.dagerPerUkeBorteFraJobb]?: number;
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
    [Field.grad]: 100,
    [Field.dagerPerUkeBorteFraJobb]: undefined
};
