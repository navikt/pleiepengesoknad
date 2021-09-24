import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Time } from '@navikt/sif-common-formik/lib/types';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { AndreYtelserFraNAV, Arbeidsform, BarnRelasjon, JobberSvar, TidEnkeltdag, VetOmsorgstilbud } from '.';

import { Arbeidsgiver } from './Søkerdata';

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
    omsorgstilbud__harBarnVærtIOmsorgstilbud = 'omsorgstilbud.harBarnVærtIOmsorgstilbud',
    omsorgstilbud__planlagt__vetHvorMyeTid = 'omsorgstilbud.planlagt.vetHvorMyeTid',
    omsorgstilbud__planlagt__erLiktHverUke = 'omsorgstilbud.planlagt.erLiktHverUke',
    omsorgstilbud__planlagt__fasteDager = 'omsorgstilbud.planlagt.fasteDager',
    omsorgstilbud__planlagt__enkeltdager = 'omsorgstilbud.planlagt.enkeltdager',
    omsorgstilbud__historisk__enkeltdager = 'omsorgstilbud.historisk.enkeltdager',
    frilans_harHattInntektSomFrilanser = 'frilans_harHattInntektSomFrilanser',
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

export interface OmsorgstilbudPlanlagt {
    vetHvorMyeTid: VetOmsorgstilbud;
    erLiktHverUke?: YesOrNo;
    fasteDager?: TidFasteDager;
    enkeltdager?: TidEnkeltdag;
}
export interface OmsorgstilbudHistorisk {
    enkeltdager: TidEnkeltdag;
}
export interface Omsorgstilbud {
    skalBarnIOmsorgstilbud?: YesOrNo;
    harBarnVærtIOmsorgstilbud?: YesOrNo;
    planlagt?: OmsorgstilbudPlanlagt;
    historisk?: OmsorgstilbudHistorisk;
}

export interface TidFasteDager {
    mandag?: Time;
    tirsdag?: Time;
    onsdag?: Time;
    torsdag?: Time;
    fredag?: Time;
}

export enum ArbeidsforholdField {
    erAnsatt = 'erAnsatt',
    arbeidsform = 'arbeidsform',
    jobberNormaltTimer = 'jobberNormaltTimer',
    historisk = 'historisk',
    planlagt = 'planlagt',
}

export enum ArbeidIPeriodeField {
    jobber = 'jobber',
    jobberSomVanlig = 'jobberSomVanlig',
    erLiktHverUke = 'erLiktHverUke',
    fasteDager = 'fasteDager',
    enkeltdager = 'enkeltdager',
}

export interface ArbeidIPeriode {
    [ArbeidIPeriodeField.jobber]: JobberSvar;
    [ArbeidIPeriodeField.jobberSomVanlig]: YesOrNo;
    [ArbeidIPeriodeField.erLiktHverUke]?: YesOrNo;
    [ArbeidIPeriodeField.enkeltdager]?: TidEnkeltdag;
    [ArbeidIPeriodeField.fasteDager]?: TidFasteDager;
}

export interface Arbeidsforhold {
    [ArbeidsforholdField.arbeidsform]?: Arbeidsform;
    [ArbeidsforholdField.jobberNormaltTimer]?: string;
    [ArbeidsforholdField.historisk]?: ArbeidIPeriode;
    [ArbeidsforholdField.planlagt]?: ArbeidIPeriode;
}
export interface ArbeidsforholdAnsatt extends Arbeidsgiver, Arbeidsforhold {
    [ArbeidsforholdField.erAnsatt]?: YesOrNo;
}

export const isArbeidsforholdAnsatt = (arbeidsforhold: any): arbeidsforhold is ArbeidsforholdAnsatt => {
    return arbeidsforhold?.navn !== undefined;
};

export type ArbeidsforholdSNF = Arbeidsforhold;

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
