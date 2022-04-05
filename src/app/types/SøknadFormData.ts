import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils';
import { AndreYtelserFraNAV, BarnRelasjon, ÅrsakManglerIdentitetsnummer } from './';
import { ArbeidsforholdFormData } from './ArbeidsforholdFormData';
import { Arbeidsgiver } from './Arbeidsgiver';
import { FrilansFormData } from './FrilansFormData';
import { SelvstendigFormData } from './SelvstendigFormData';

export enum SøknadFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    barnetsNavn = 'barnetsNavn',
    barnetsFødselsnummer = 'barnetsFødselsnummer',
    barnetsFødselsdato = 'barnetsFødselsdato',
    barnetSøknadenGjelder = 'barnetSøknadenGjelder',
    relasjonTilBarnet = 'relasjonTilBarnet',
    relasjonTilBarnetBeskrivelse = 'relasjonTilBarnetBeskrivelse',
    søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    barnetHarIkkeFnr = 'barnetHarIkkeFnr',
    årsakManglerIdentitetsnummer = 'årsakManglerIdentitetsnummer',
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    skalPassePåBarnetIHelePerioden = 'skalPassePåBarnetIHelePerioden',
    beskrivelseOmsorgsrolleIPerioden = 'beskrivelseOmsorgsrolleIPerioden',
    legeerklæring = 'legeerklæring',
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
    omsorgstilbud = 'omsorgstilbud',
    omsorgstilbud_gruppe = 'omsorgstilbud_gruppe',
    omsorgstilbud__erIOmsorgstilbud = 'omsorgstilbud.erIOmsorgstilbud',
    omsorgstilbud__erLiktHverUke = 'omsorgstilbud.erLiktHverUke',
    omsorgstilbud__fasteDager = 'omsorgstilbud.fasteDager',
    omsorgstilbud__enkeltdager = 'omsorgstilbud.enkeltdager',
    ansatt_arbeidsforhold = 'ansatt_arbeidsforhold',
    harVærtEllerErVernepliktig = 'harVærtEllerErVernepliktig',
    mottarAndreYtelser = 'mottarAndreYtelser',
    andreYtelser = 'andreYtelser',
    frilans = 'frilans',
    selvstendig = 'selvstendig',
    frilansoppdrag = 'frilansoppdrag',
}

export interface OmsorgstilbudFormData {
    erIOmsorgstilbud?: YesOrNo;
    erLiktHverUke?: YesOrNo;
    fasteDager?: DurationWeekdays;
    enkeltdager?: DateDurationMap;
}

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;
    [SøknadFormField.barnetsNavn]: string;
    [SøknadFormField.barnetsFødselsnummer]: string;
    [SøknadFormField.barnetsFødselsdato]?: string;
    [SøknadFormField.årsakManglerIdentitetsnummer]?: ÅrsakManglerIdentitetsnummer;
    [SøknadFormField.søknadenGjelderEtAnnetBarn]: boolean;
    [SøknadFormField.barnetHarIkkeFnr]: boolean;
    [SøknadFormField.barnetSøknadenGjelder]: string;
    [SøknadFormField.relasjonTilBarnet]?: BarnRelasjon;
    [SøknadFormField.relasjonTilBarnetBeskrivelse]?: string;
    [SøknadFormField.periodeFra]?: string;
    [SøknadFormField.periodeTil]?: string;
    [SøknadFormField.skalPassePåBarnetIHelePerioden]?: YesOrNo;
    [SøknadFormField.beskrivelseOmsorgsrolleIPerioden]?: string;
    [SøknadFormField.legeerklæring]: Attachment[];
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: Utenlandsopphold[];
    [SøknadFormField.skalOppholdeSegIUtlandetIPerioden]?: YesOrNo;
    [SøknadFormField.utenlandsoppholdIPerioden]?: Utenlandsopphold[];
    [SøknadFormField.skalTaUtFerieIPerioden]?: YesOrNo;
    [SøknadFormField.ferieuttakIPerioden]?: Ferieuttak[];
    [SøknadFormField.harMedsøker]: YesOrNo;
    [SøknadFormField.samtidigHjemme]: YesOrNo;
    [SøknadFormField.omsorgstilbud]?: OmsorgstilbudFormData;
    [SøknadFormField.harNattevåk]: YesOrNo;
    [SøknadFormField.harNattevåk_ekstrainfo]?: string;
    [SøknadFormField.harBeredskap]: YesOrNo;
    [SøknadFormField.harBeredskap_ekstrainfo]?: string;
    [SøknadFormField.harVærtEllerErVernepliktig]?: YesOrNo;
    [SøknadFormField.mottarAndreYtelser]?: YesOrNo;
    [SøknadFormField.andreYtelser]?: AndreYtelserFraNAV[];
    [SøknadFormField.frilans]: FrilansFormData;
    [SøknadFormField.selvstendig]: SelvstendigFormData;
    [SøknadFormField.frilansoppdrag]: Arbeidsgiver[];
    [SøknadFormField.ansatt_arbeidsforhold]: ArbeidsforholdFormData[];
}

export const initialValues: SøknadFormData = {
    [SøknadFormField.periodeFra]: undefined,
    [SøknadFormField.periodeTil]: undefined,
    [SøknadFormField.barnetsNavn]: '',
    [SøknadFormField.barnetsFødselsnummer]: '',
    [SøknadFormField.barnetSøknadenGjelder]: '',
    [SøknadFormField.harForståttRettigheterOgPlikter]: false,
    [SøknadFormField.harBekreftetOpplysninger]: false,
    [SøknadFormField.søknadenGjelderEtAnnetBarn]: false,
    [SøknadFormField.barnetHarIkkeFnr]: false,
    [SøknadFormField.årsakManglerIdentitetsnummer]: undefined,
    [SøknadFormField.legeerklæring]: [],
    [SøknadFormField.ansatt_arbeidsforhold]: [],
    [SøknadFormField.barnetsFødselsdato]: undefined,
    [SøknadFormField.harBoddUtenforNorgeSiste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: [],
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: [],
    [SøknadFormField.skalOppholdeSegIUtlandetIPerioden]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandsoppholdIPerioden]: [],
    [SøknadFormField.skalTaUtFerieIPerioden]: YesOrNo.UNANSWERED,
    [SøknadFormField.ferieuttakIPerioden]: [],
    [SøknadFormField.harMedsøker]: YesOrNo.UNANSWERED,
    [SøknadFormField.samtidigHjemme]: YesOrNo.UNANSWERED,
    [SøknadFormField.omsorgstilbud]: undefined,
    [SøknadFormField.harNattevåk]: YesOrNo.UNANSWERED,
    [SøknadFormField.harBeredskap]: YesOrNo.UNANSWERED,
    [SøknadFormField.andreYtelser]: [],
    [SøknadFormField.frilans]: {
        harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    },
    [SøknadFormField.selvstendig]: {
        harHattInntektSomSN: YesOrNo.UNANSWERED,
    },
    [SøknadFormField.frilansoppdrag]: [],
};

export type MedlemskapFormData = Pick<
    SøknadFormData,
    | SøknadFormField.harBoddUtenforNorgeSiste12Mnd
    | SøknadFormField.utenlandsoppholdSiste12Mnd
    | SøknadFormField.skalBoUtenforNorgeNeste12Mnd
    | SøknadFormField.utenlandsoppholdNeste12Mnd
>;
