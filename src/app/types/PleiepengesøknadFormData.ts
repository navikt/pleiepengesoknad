import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Time } from '@navikt/sif-common-formik/lib/types';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { TidIOmsorgstilbud } from '../components/omsorgstilbud/types';
import { VetOmsorgstilbud } from './PleiepengesøknadApiData';
import { Arbeidsgiver } from './Søkerdata';

export enum ArbeidsforholdSkalJobbeSvar {
    'ja' = 'ja',
    'nei' = 'nei',
    'redusert' = 'redusert',
    'vetIkke' = 'vetIkke',
}

export interface OmsorgstilbudFasteDager {
    mandag?: Time;
    tirsdag?: Time;
    onsdag?: Time;
    torsdag?: Time;
    fredag?: Time;
}

export interface OmsorgstilbudInfo {
    vetHvorMyeTid: VetOmsorgstilbud;
    erLiktHverDag?: YesOrNo;
    fasteDager?: OmsorgstilbudFasteDager;
    enkeltdager?: TidIOmsorgstilbud;
}
export interface Omsorgstilbud {
    skalBarnIOmsorgstilbud: YesOrNo;
    ja?: OmsorgstilbudInfo;
}

export enum AppFormField {
    harForståttRettigheterOgPlikter = 'harForståttRettigheterOgPlikter',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
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
    omsorgstilbud = 'omsorgstilbud',
    omsorgstilbud__skalBarnIOmsorgstilbud = 'omsorgstilbud.skalBarnIOmsorgstilbud',
    omsorgstilbud__ja__vetHvorMyeTid = 'omsorgstilbud.ja.vetHvorMyeTid',
    omsorgstilbud__ja_erLiktHverDag = 'omsorgstilbud.ja.erLiktHverDag',
    omsorgstilbud__ja__fasteDager = 'omsorgstilbud.ja.fasteDager',
    omsorgstilbud__ja__enkeltdager = 'omsorgstilbud.ja.enkeltdager',
    frilans_harHattInntektSomFrilanser = 'harHattInntektSomFrilanser',
    frilans_startdato = 'frilans_startdato',
    frilans_sluttdato = 'frilans_sluttdato',
    frilans_jobberFortsattSomFrilans = 'frilans_jobberFortsattSomFrilans',
    frilans_arbeidsforhold = 'frilans_arbeidsforhold',
    selvstendig_harHattInntektSomSN = 'selvstendig_harHattInntektSomSN',
    selvstendig_harFlereVirksomheter = 'selvstendig_harFlereVirksomheter',
    selvstendig_virksomhet = 'selvstendig_virksomhet',
    selvstendig_arbeidsforhold = 'selvstendig_arbeidsforhold',
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

export enum ArbeidsforholdSNFField {
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
    [ArbeidsforholdField.jobberNormaltTimer]?: string;
    [ArbeidsforholdField.skalJobbe]?: ArbeidsforholdSkalJobbeSvar;
    [ArbeidsforholdField.timerEllerProsent]?: 'timer' | 'prosent';
    [ArbeidsforholdField.skalJobbeTimer]?: string;
    [ArbeidsforholdField.skalJobbeProsent]?: string;
    [ArbeidsforholdField.arbeidsform]?: Arbeidsform;
}

export interface ArbeidsforholdSNF {
    [ArbeidsforholdSNFField.jobberNormaltTimer]?: string;
    [ArbeidsforholdSNFField.skalJobbe]?: ArbeidsforholdSkalJobbeSvar;
    [ArbeidsforholdSNFField.timerEllerProsent]?: 'timer' | 'prosent';
    [ArbeidsforholdSNFField.skalJobbeTimer]?: string;
    [ArbeidsforholdSNFField.skalJobbeProsent]?: string;
    [ArbeidsforholdSNFField.arbeidsform]?: Arbeidsform;
}

export enum BarnRelasjon {
    MOR = 'MOR',
    FAR = 'FAR',
    MEDMOR = 'MEDMOR',
    FOSTERFORELDER = 'FOSTERFORELDER',
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
    [AppFormField.omsorgstilbud]?: Omsorgstilbud;
    [AppFormField.omsorgstilbud__ja_erLiktHverDag]?: YesOrNo;
    [AppFormField.harNattevåk]: YesOrNo;
    [AppFormField.harNattevåk_ekstrainfo]?: string;
    [AppFormField.harBeredskap]: YesOrNo;
    [AppFormField.harBeredskap_ekstrainfo]?: string;
    [AppFormField.frilans_harHattInntektSomFrilanser]?: YesOrNo;
    [AppFormField.frilans_startdato]?: string;
    [AppFormField.frilans_sluttdato]?: string;
    [AppFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [AppFormField.frilans_arbeidsforhold]?: ArbeidsforholdSNF;
    [AppFormField.selvstendig_harHattInntektSomSN]?: YesOrNo;
    [AppFormField.selvstendig_harFlereVirksomheter]?: YesOrNo;
    [AppFormField.selvstendig_virksomhet]?: Virksomhet;
    [AppFormField.selvstendig_arbeidsforhold]?: ArbeidsforholdSNF;
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
    [AppFormField.omsorgstilbud]: undefined,
    [AppFormField.harNattevåk]: YesOrNo.UNANSWERED,
    [AppFormField.harBeredskap]: YesOrNo.UNANSWERED,
    [AppFormField.frilans_harHattInntektSomFrilanser]: YesOrNo.UNANSWERED,
    [AppFormField.selvstendig_harHattInntektSomSN]: YesOrNo.UNANSWERED,
    [AppFormField.selvstendig_virksomhet]: undefined,
    [AppFormField.andreYtelser]: [],
};
