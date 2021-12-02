import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { InputTime } from '@navikt/sif-common-formik/lib/types';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { AndreYtelserFraNAV, BarnRelasjon, JobberIPeriodeSvar, DatoTidMap, TimerEllerProsent } from './';
import { Arbeidsgiver } from './Søkerdata';

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
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    skalPassePåBarnetIHelePerioden = 'skalPassePåBarnetIHelePerioden',
    beskrivelseOmsorgsrolleIPerioden = 'beskrivelseOmsorgsrolleIPerioden',
    legeerklæring = 'legeerklæring',
    ansatt_arbeidsforhold = 'ansatt_arbeidsforhold',
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
    erLiktHverUke?: YesOrNo;
    fasteDager?: TidFasteDager;
    enkeltdager?: DatoTidMap;
}
export interface OmsorgstilbudHistorisk {
    enkeltdager: DatoTidMap;
}
export interface Omsorgstilbud {
    skalBarnIOmsorgstilbud?: YesOrNo;
    harBarnVærtIOmsorgstilbud?: YesOrNo;
    planlagt?: OmsorgstilbudPlanlagt;
    historisk?: OmsorgstilbudHistorisk;
}

export interface TidFasteDager {
    mandag?: InputTime;
    tirsdag?: InputTime;
    onsdag?: InputTime;
    torsdag?: InputTime;
    fredag?: InputTime;
}

export enum ArbeidsforholdField {
    erAnsatt = 'erAnsatt',
    sluttetFørSøknadsperiode = 'sluttetFørSøknadsperiode',
    jobberNormaltTimer = 'jobberNormaltTimer',
    historisk = 'historisk',
    planlagt = 'planlagt',
}

export enum ArbeidIPeriodeField {
    jobberIPerioden = 'jobberIPerioden',
    erLiktHverUke = 'erLiktHverUke',
    timerEllerProsent = 'timerEllerProsent',
    skalJobbeProsent = 'skalJobbeProsent',
    fasteDager = 'fasteDager',
    enkeltdager = 'enkeltdager',
}

export interface ArbeidIPeriode {
    [ArbeidIPeriodeField.jobberIPerioden]: JobberIPeriodeSvar;
    [ArbeidIPeriodeField.erLiktHverUke]?: YesOrNo;
    [ArbeidIPeriodeField.timerEllerProsent]?: TimerEllerProsent;
    [ArbeidIPeriodeField.skalJobbeProsent]?: string;
    [ArbeidIPeriodeField.enkeltdager]?: DatoTidMap;
    [ArbeidIPeriodeField.fasteDager]?: TidFasteDager;
}

export interface Arbeidsforhold {
    [ArbeidsforholdField.jobberNormaltTimer]?: string;
    [ArbeidsforholdField.historisk]?: ArbeidIPeriode;
    [ArbeidsforholdField.planlagt]?: ArbeidIPeriode;
}
export interface ArbeidsforholdAnsatt extends Arbeidsgiver, Arbeidsforhold {
    [ArbeidsforholdField.erAnsatt]?: YesOrNo;
    [ArbeidsforholdField.sluttetFørSøknadsperiode]?: YesOrNo;
}

export const isArbeidsforholdAnsatt = (arbeidsforhold: any): arbeidsforhold is ArbeidsforholdAnsatt => {
    return arbeidsforhold?.navn !== undefined;
};

export type ArbeidsforholdSNF = Arbeidsforhold;

export interface SøknadFormData {
    [SøknadFormField.harForståttRettigheterOgPlikter]: boolean;
    [SøknadFormField.harBekreftetOpplysninger]: boolean;
    [SøknadFormField.barnetsNavn]: string;
    [SøknadFormField.barnetsFødselsnummer]: string;
    [SøknadFormField.barnetsFødselsdato]?: string;
    [SøknadFormField.søknadenGjelderEtAnnetBarn]: boolean;
    [SøknadFormField.barnetSøknadenGjelder]: string;
    [SøknadFormField.relasjonTilBarnet]?: BarnRelasjon;
    [SøknadFormField.relasjonTilBarnetBeskrivelse]?: string;
    [SøknadFormField.ansatt_arbeidsforhold]: ArbeidsforholdAnsatt[];
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
    [SøknadFormField.omsorgstilbud]?: Omsorgstilbud;
    [SøknadFormField.harNattevåk]: YesOrNo;
    [SøknadFormField.harNattevåk_ekstrainfo]?: string;
    [SøknadFormField.harBeredskap]: YesOrNo;
    [SøknadFormField.harBeredskap_ekstrainfo]?: string;
    [SøknadFormField.frilans_harHattInntektSomFrilanser]?: YesOrNo;
    [SøknadFormField.frilans_startdato]?: string;
    [SøknadFormField.frilans_sluttdato]?: string;
    [SøknadFormField.frilans_jobberFortsattSomFrilans]?: YesOrNo;
    [SøknadFormField.frilans_arbeidsforhold]?: ArbeidsforholdSNF;
    [SøknadFormField.selvstendig_harHattInntektSomSN]?: YesOrNo;
    [SøknadFormField.selvstendig_harFlereVirksomheter]?: YesOrNo;
    [SøknadFormField.selvstendig_virksomhet]?: Virksomhet;
    [SøknadFormField.selvstendig_arbeidsforhold]?: ArbeidsforholdSNF;
    [SøknadFormField.harVærtEllerErVernepliktig]?: YesOrNo;
    [SøknadFormField.mottarAndreYtelser]?: YesOrNo;
    [SøknadFormField.andreYtelser]?: AndreYtelserFraNAV[];
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
    [SøknadFormField.frilans_harHattInntektSomFrilanser]: YesOrNo.UNANSWERED,
    [SøknadFormField.selvstendig_harHattInntektSomSN]: YesOrNo.UNANSWERED,
    [SøknadFormField.selvstendig_virksomhet]: undefined,
    [SøknadFormField.andreYtelser]: [],
};
