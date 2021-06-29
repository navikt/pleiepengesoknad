import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Time } from '@navikt/sif-common-formik/lib/types';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Arbeidsgiver } from './Søkerdata';

export enum ArbeidsforholdSkalJobbeSvar {
    'ja' = 'ja',
    'nei' = 'nei',
    'vetIkke' = 'vetIkke',
}

export interface OmsorgstilbudFasteDager {
    mandag?: Time;
    tirsdag?: Time;
    onsdag?: Time;
    torsdag?: Time;
    fredag?: Time;
}

export interface Omsorgstilbud {
    skalBarnIOmsorgstilbud: YesOrNo;
    ja?: {
        hvorMyeTid?: OmsorgstilbudVetPeriode;
        vetMinAntallTimer?: YesOrNo;
        fasteDager?: OmsorgstilbudFasteDager;
    };
}

export type FrilansEllerSelvstendig = 'frilans' | 'selvstendig';

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
    omsorgstilbud__ja__hvorMyeTid = 'omsorgstilbud.ja.hvorMyeTid',
    omsorgstilbud__ja__fasteDager = 'omsorgstilbud.ja.fasteDager',
    omsorgstilbud__ja__vetMinAntallTimer = 'omsorgstilbud.ja.vetMinAntallTimer',
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
    skalJobbeHvorMye = 'skalJobbeHvorMye',
}
export enum ArbeidsforholdSkalJobbeHvorMyeSvar {
    redusert = 'redusert',
    somVanlig = 'somVanlig',
}

export enum ArbeidsforholdSNFField {
    skalJobbe = 'skalJobbe',
    timerEllerProsent = 'timerEllerProsent',
    jobberNormaltTimer = 'jobberNormaltTimer',
    skalJobbeTimer = 'skalJobbeTimer',
    skalJobbeProsent = 'skalJobbeProsent',
    arbeidsform = 'arbeidsform',
    skalJobbeHvorMye = 'skalJobbeHvorMye',
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
export interface Arbeidsforhold {
    [ArbeidsforholdField.skalJobbe]?: ArbeidsforholdSkalJobbeSvar;
    [ArbeidsforholdField.arbeidsform]?: Arbeidsform;
    [ArbeidsforholdField.jobberNormaltTimer]?: string;
    [ArbeidsforholdField.timerEllerProsent]?: 'timer' | 'prosent';
    [ArbeidsforholdField.skalJobbeTimer]?: string;
    [ArbeidsforholdField.skalJobbeProsent]?: string;
    [ArbeidsforholdField.skalJobbeHvorMye]?: ArbeidsforholdSkalJobbeHvorMyeSvar;
}
export interface ArbeidsforholdAnsatt extends Arbeidsgiver, Arbeidsforhold {
    [ArbeidsforholdField.erAnsattIPerioden]?: YesOrNo;
}

export const isArbeidsforholdAnsatt = (arbeidsforhold: any): arbeidsforhold is ArbeidsforholdAnsatt => {
    return arbeidsforhold?.navn !== undefined;
};

export type ArbeidsforholdSNF = Arbeidsforhold;

export enum OmsorgstilbudVetPeriode {
    'vetHelePerioden' = 'vetHelePerioden',
    'usikker' = 'usikker',
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
    [AppFormField.arbeidsforhold]: ArbeidsforholdAnsatt[];
    [AppFormField.periodeFra]?: string;
    [AppFormField.periodeTil]?: string;
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
