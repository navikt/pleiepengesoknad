import { Attachment } from '@navikt/sif-common-core-ds/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core-ds/lib/types/YesOrNo';
import { Ferieuttak } from '@navikt/sif-common-forms-ds/lib/forms/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms-ds/lib/forms/utenlandsopphold/types';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils';
import { BarnRelasjon, ÅrsakManglerIdentitetsnummer } from '.';
import { ArbeidsforholdFormValues } from './ArbeidsforholdFormValues';
import { Arbeidsgiver } from './Arbeidsgiver';
import { FrilansFormData } from './FrilansFormData';
import { SelvstendigFormData } from './SelvstendigFormData';
import { OpptjeningUtland } from '@navikt/sif-common-forms-ds/lib/forms/opptjening-utland';
import { UtenlandskNæring } from '@navikt/sif-common-forms-ds/lib/forms/utenlandsk-næring';
import { BostedUtland } from '@navikt/sif-common-forms-ds/lib';
import { StønadGodtgjørelseFormData } from '../types/StønadGodtgjørelseFormData';
import { YesOrNoOrDoNotKnow } from './YesOrNoOrDoNotKnow';

export enum SøknadFormField {
    brukForrigeSøknad = 'brukForrigeSøknad',
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
    fødselsattest = 'fødselsattest',
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
    harNattevåk = 'harNattevåk',
    harNattevåk_ekstrainfo = 'harNattevåk_ekstrainfo',
    harBeredskap = 'harBeredskap',
    harBeredskap_ekstrainfo = 'harBeredskap_ekstrainfo',
    omsorgstilbud = 'omsorgstilbud',
    omsorgstilbud_gruppe = 'omsorgstilbud_gruppe',
    omsorgstilbud__erIOmsorgstilbud_fortid = 'omsorgstilbud.erIOmsorgstilbudFortid',
    omsorgstilbud__erIOmsorgstilbud_fremtid = 'omsorgstilbud.erIOmsorgstilbudFremtid',
    omsorgstilbud__erLiktHverUke = 'omsorgstilbud.erLiktHverUke',
    omsorgstilbud__fasteDager = 'omsorgstilbud.fasteDager',
    omsorgstilbud__enkeltdager = 'omsorgstilbud.enkeltdager',
    ansatt_arbeidsforhold = 'ansatt_arbeidsforhold',
    harVærtEllerErVernepliktig = 'harVærtEllerErVernepliktig',
    frilans = 'frilans',
    stønadGodtgjørelse = 'stønadGodtgjørelse',
    selvstendig = 'selvstendig',
    frilansoppdrag = 'frilansoppdrag',
    harOpptjeningUtland = 'harOpptjeningUtland',
    opptjeningUtland = 'opptjeningUtland',
    harUtenlandskNæring = 'harUtenlandskNæring',
    utenlandskNæring = 'utenlandskNæring',
}

export interface OmsorgstilbudFormValues {
    erIOmsorgstilbudFortid?: YesOrNoOrDoNotKnow;
    erIOmsorgstilbudFremtid?: YesOrNoOrDoNotKnow;
    erLiktHverUke?: YesOrNo;
    fasteDager?: DurationWeekdays;
    enkeltdager?: DateDurationMap;
}

export interface SøknadFormValues {
    [SøknadFormField.brukForrigeSøknad]?: YesOrNo;
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;
    [SøknadFormField.barnetsNavn]: string;
    [SøknadFormField.barnetsFødselsnummer]: string;
    [SøknadFormField.barnetsFødselsdato]?: string;
    [SøknadFormField.årsakManglerIdentitetsnummer]?: ÅrsakManglerIdentitetsnummer;
    [SøknadFormField.fødselsattest]: Attachment[];
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
    [SøknadFormField.utenlandsoppholdSiste12Mnd]: BostedUtland[];
    [SøknadFormField.skalBoUtenforNorgeNeste12Mnd]: YesOrNo;
    [SøknadFormField.utenlandsoppholdNeste12Mnd]: BostedUtland[];
    [SøknadFormField.skalOppholdeSegIUtlandetIPerioden]?: YesOrNo;
    [SøknadFormField.utenlandsoppholdIPerioden]?: Utenlandsopphold[];
    [SøknadFormField.skalTaUtFerieIPerioden]?: YesOrNo;
    [SøknadFormField.ferieuttakIPerioden]?: Ferieuttak[];
    [SøknadFormField.omsorgstilbud]?: OmsorgstilbudFormValues;
    [SøknadFormField.harNattevåk]: YesOrNo;
    [SøknadFormField.harNattevåk_ekstrainfo]?: string;
    [SøknadFormField.harBeredskap]: YesOrNo;
    [SøknadFormField.harBeredskap_ekstrainfo]?: string;
    [SøknadFormField.harVærtEllerErVernepliktig]?: YesOrNo;
    [SøknadFormField.frilans]: FrilansFormData;
    [SøknadFormField.stønadGodtgjørelse]: StønadGodtgjørelseFormData;

    [SøknadFormField.selvstendig]: SelvstendigFormData;
    [SøknadFormField.frilansoppdrag]: Arbeidsgiver[];
    [SøknadFormField.ansatt_arbeidsforhold]: ArbeidsforholdFormValues[];
    [SøknadFormField.harOpptjeningUtland]: YesOrNo;
    [SøknadFormField.opptjeningUtland]: OpptjeningUtland[];
    [SøknadFormField.harUtenlandskNæring]: YesOrNo;
    [SøknadFormField.utenlandskNæring]: UtenlandskNæring[];
}

export const initialValues: SøknadFormValues = {
    [SøknadFormField.brukForrigeSøknad]: undefined,
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
    [SøknadFormField.fødselsattest]: [],
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
    [SøknadFormField.omsorgstilbud]: undefined,
    [SøknadFormField.harNattevåk]: YesOrNo.UNANSWERED,
    [SøknadFormField.harBeredskap]: YesOrNo.UNANSWERED,
    [SøknadFormField.frilans]: {
        harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    },
    [SøknadFormField.stønadGodtgjørelse]: {
        mottarStønadGodtgjørelse: YesOrNo.UNANSWERED,
    },
    [SøknadFormField.selvstendig]: {
        harHattInntektSomSN: YesOrNo.UNANSWERED,
    },
    [SøknadFormField.frilansoppdrag]: [],
    [SøknadFormField.harOpptjeningUtland]: YesOrNo.UNANSWERED,
    [SøknadFormField.opptjeningUtland]: [],
    [SøknadFormField.harUtenlandskNæring]: YesOrNo.UNANSWERED,
    [SøknadFormField.utenlandskNæring]: [],
};

export type MedlemskapFormData = Pick<
    SøknadFormValues,
    | SøknadFormField.harBoddUtenforNorgeSiste12Mnd
    | SøknadFormField.utenlandsoppholdSiste12Mnd
    | SøknadFormField.skalBoUtenforNorgeNeste12Mnd
    | SøknadFormField.utenlandsoppholdNeste12Mnd
>;

export type OmBarnetFormData = Pick<
    SøknadFormValues,
    | SøknadFormField.barnetSøknadenGjelder
    | SøknadFormField.barnetsNavn
    | SøknadFormField.barnetsFødselsnummer
    | SøknadFormField.barnetHarIkkeFnr
    | SøknadFormField.årsakManglerIdentitetsnummer
    | SøknadFormField.barnetsFødselsdato
    | SøknadFormField.relasjonTilBarnet
    | SøknadFormField.relasjonTilBarnetBeskrivelse
    | SøknadFormField.fødselsattest
>;
