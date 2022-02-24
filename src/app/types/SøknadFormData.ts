import { Arbeidsforhold, ArbeidsforholdField, ArbeidsforholdFrilanser } from './Arbeidsforhold';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { Virksomhet } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { DurationWeekdays, DateDurationMap, ISODate } from '@navikt/sif-common-utils';
import { AndreYtelserFraNAV, BarnRelasjon, JobberIPeriodeSvar, TimerEllerProsent } from './';

export * from './Arbeidsforhold';
export * from './Arbeidsgiver';

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
    frilans_harHattInntektSomFrilanser = 'frilans.harHattInntektSomFrilanser',
    frilans_startdato = 'frilans.startdato',
    frilans_sluttdato = 'frilans.sluttdato',
    frilans_jobberFortsattSomFrilans = 'frilans.jobberFortsattSomFrilans',
    frilans_arbeidsforhold = 'frilans.arbeidsforhold',
    frilans = 'frilans',
    selvstendig_harHattInntektSomSN = 'selvstendig_harHattInntektSomSN',
    selvstendig_harFlereVirksomheter = 'selvstendig_harFlereVirksomheter',
    selvstendig_virksomhet = 'selvstendig_virksomhet',
    selvstendig_arbeidsforhold = 'selvstendig_arbeidsforhold',
    harVærtEllerErVernepliktig = 'harVærtEllerErVernepliktig',
    mottarAndreYtelser = 'mottarAndreYtelser',
    andreYtelser = 'andreYtelser',
}

export interface Omsorgstilbud {
    erIOmsorgstilbud?: YesOrNo;
    erLiktHverUke?: YesOrNo;
    fasteDager?: DurationWeekdays;
    enkeltdager?: DateDurationMap;
}

export enum ArbeidIPeriodeField {
    jobberIPerioden = 'jobberIPerioden',
    erLiktHverUke = 'erLiktHverUke',
    timerEllerProsent = 'timerEllerProsent',
    jobberProsent = 'jobberProsent',
    fasteDager = 'fasteDager',
    enkeltdager = 'enkeltdager',
}

export interface ArbeidIPeriode {
    [ArbeidIPeriodeField.jobberIPerioden]: JobberIPeriodeSvar;
    [ArbeidIPeriodeField.erLiktHverUke]?: YesOrNo;
    [ArbeidIPeriodeField.timerEllerProsent]?: TimerEllerProsent;
    [ArbeidIPeriodeField.jobberProsent]?: string;
    [ArbeidIPeriodeField.enkeltdager]?: DateDurationMap;
    [ArbeidIPeriodeField.fasteDager]?: DurationWeekdays;
}

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
    [SøknadFormField.selvstendig_harHattInntektSomSN]?: YesOrNo;
    [SøknadFormField.selvstendig_harFlereVirksomheter]?: YesOrNo;
    [SøknadFormField.selvstendig_virksomhet]?: Virksomhet;
    [SøknadFormField.harVærtEllerErVernepliktig]?: YesOrNo;
    [SøknadFormField.mottarAndreYtelser]?: YesOrNo;
    [SøknadFormField.andreYtelser]?: AndreYtelserFraNAV[];
    [SøknadFormField.frilans]: FrilansFormDataPart;
    [SøknadFormField.ansatt_arbeidsforhold]: Arbeidsforhold[];
    [SøknadFormField.selvstendig_arbeidsforhold]?: Arbeidsforhold;
    [SøknadFormField.frilans_arbeidsforhold]?: ArbeidsforholdFrilanser;
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
    [SøknadFormField.selvstendig_harHattInntektSomSN]: YesOrNo.UNANSWERED,
    [SøknadFormField.selvstendig_virksomhet]: undefined,
    [SøknadFormField.andreYtelser]: [],
    frilans: {
        harHattInntektSomFrilanser: YesOrNo.UNANSWERED,
    },
};

export interface FrilansFormDataPart {
    harHattInntektSomFrilanser?: YesOrNo;
    jobberFortsattSomFrilans?: YesOrNo;
    startdato?: ISODate;
    sluttdato?: ISODate;
    arbeidsforhold?: Pick<
        Arbeidsforhold,
        | ArbeidsforholdField.jobberNormaltTimer
        | ArbeidsforholdField.arbeidIPeriode
        | ArbeidsforholdField.harFraværIPeriode
    >;
}
