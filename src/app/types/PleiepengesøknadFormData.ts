import { Ansettelsesforhold, HoursOrPercent } from './Søkerdata';
import { YesOrNo } from './YesOrNo';
import { Time } from './Time';

export interface AnsettelsesforholdForm extends Ansettelsesforhold {
    skalArbeide?: YesOrNo;
    timer_normalt?: Time;
    timer_redusert?: Time;
    prosent_redusert?: number;
    pstEllerTimer?: HoursOrPercent;
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
    grad = 'grad'
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
    // [Field.ansettelsesforhold]: [],
    [Field.barnetHarIkkeFåttFødselsnummerEnda]: false,
    [Field.barnetsForeløpigeFødselsnummerEllerDNummer]: '',
    [Field.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [Field.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [Field.harMedsøker]: YesOrNo.UNANSWERED,
    [Field.grad]: 100,
    [Field.ansettelsesforhold]: [
        {
            navn: 'Arbeids- og velferdsetaten',
            organisasjonsnummer: '123451234',
            timer_normalt: { hours: 20, minutes: 10 },
            skalArbeide: YesOrNo.YES,
            pstEllerTimer: HoursOrPercent.hours,
            timer_redusert: { hours: 10, minutes: 5 }
        },
        {
            navn: 'Arbeids- og sosialdepartementet',
            organisasjonsnummer: '123451235',
            timer_normalt: { hours: 20, minutes: 10 },
            skalArbeide: YesOrNo.YES,
            pstEllerTimer: HoursOrPercent.percent,
            prosent_redusert: 50
        }
    ]
};
