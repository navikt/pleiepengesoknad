import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { FrilanserOppdragIPeriodenApi } from '../../../types/søknad-api-data/frilansOppdragApiData';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilanserMedOppdragFormValues,
    NormalarbeidstidFormValues,
} from '../../../types/ArbeidsforholdFormValues';
import { FrilanserOppdragType } from '../../../types/FrilansFormData';
import { SelvstendigFormData } from '../../../types/SelvstendigFormData';
import { SøknadFormValues } from '../../../types/SøknadFormValues';
import { visVernepliktSpørsmål } from './visVernepliktSpørsmål';

const cleanupNormalarbeidstid = ({
    erLiktSomForrigeSøknad,
    timerPerUke,
}: NormalarbeidstidFormValues): NormalarbeidstidFormValues => {
    if (erLiktSomForrigeSøknad === YesOrNo.YES) {
        return {
            erLiktSomForrigeSøknad,
            timerPerUke,
        };
    }

    return {
        timerPerUke,
    };
};

export const cleanupAnsattArbeidsforhold = (arbeidsforhold: ArbeidsforholdFormValues): ArbeidsforholdFormValues => {
    const cleanedArbeidsforhold = { ...arbeidsforhold };

    if (cleanedArbeidsforhold.erAnsatt === YesOrNo.YES) {
        cleanedArbeidsforhold.sluttetFørSøknadsperiode = undefined;
    }
    if (
        cleanedArbeidsforhold.erAnsatt === YesOrNo.NO &&
        cleanedArbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.YES
    ) {
        cleanedArbeidsforhold.normalarbeidstid = undefined;
        cleanedArbeidsforhold.sluttetFørSøknadsperiode = YesOrNo.YES;
        cleanedArbeidsforhold.arbeidIPeriode = undefined;
    }
    if (cleanedArbeidsforhold.normalarbeidstid) {
        cleanedArbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(cleanedArbeidsforhold.normalarbeidstid);
    }
    return cleanedArbeidsforhold;
};

export const cleanupFrilansArbeidsforhold = (
    arbeidsforhold: ArbeidsforholdFrilanserMedOppdragFormValues
): ArbeidsforholdFrilanserMedOppdragFormValues => {
    const cleanedFrilansoppdrag = { ...arbeidsforhold };
    if (cleanedFrilansoppdrag.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.NEI) {
        cleanedFrilansoppdrag.sluttdato = undefined;
        cleanedFrilansoppdrag.normalarbeidstid = undefined;
        cleanedFrilansoppdrag.frilansOppdragKategori = undefined;
        cleanedFrilansoppdrag.styremedlemHeleInntekt = undefined;
        cleanedFrilansoppdrag.arbeidIPeriode = undefined;
    }
    if (cleanedFrilansoppdrag.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA) {
        cleanedFrilansoppdrag.sluttdato = undefined;
    }

    if (cleanedFrilansoppdrag.frilansOppdragKategori !== FrilanserOppdragType.STYREMEDLEM_ELLER_VERV) {
        cleanedFrilansoppdrag.styremedlemHeleInntekt = undefined;
    }
    if (
        cleanedFrilansoppdrag.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV &&
        cleanedFrilansoppdrag.styremedlemHeleInntekt === YesOrNo.YES
    ) {
        cleanedFrilansoppdrag.normalarbeidstid = undefined;
        cleanedFrilansoppdrag.arbeidIPeriode = undefined;
    }
    if (cleanedFrilansoppdrag.frilansOppdragKategori === FrilanserOppdragType.FOSTERFORELDER) {
        cleanedFrilansoppdrag.normalarbeidstid = undefined;
        cleanedFrilansoppdrag.arbeidIPeriode = undefined;
        cleanedFrilansoppdrag.styremedlemHeleInntekt = undefined;
    }

    if (cleanedFrilansoppdrag.normalarbeidstid) {
        cleanedFrilansoppdrag.normalarbeidstid = cleanupNormalarbeidstid(cleanedFrilansoppdrag.normalarbeidstid);
    }
    return cleanedFrilansoppdrag;
};

export const cleanupNyFrilansArbeidsforhold = (
    nyFrilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues
): ArbeidsforholdFrilanserMedOppdragFormValues => {
    const cleanedNyFrilansoppdrag = { ...nyFrilansoppdrag };

    if (cleanedNyFrilansoppdrag.sluttet !== true) {
        cleanedNyFrilansoppdrag.arbeidsgiver.ansattTom = undefined;
    }

    if (cleanedNyFrilansoppdrag.frilansOppdragKategori !== FrilanserOppdragType.STYREMEDLEM_ELLER_VERV) {
        cleanedNyFrilansoppdrag.styremedlemHeleInntekt = undefined;
    }

    if (
        cleanedNyFrilansoppdrag.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV &&
        cleanedNyFrilansoppdrag.styremedlemHeleInntekt === YesOrNo.YES
    ) {
        cleanedNyFrilansoppdrag.normalarbeidstid = undefined;
        cleanedNyFrilansoppdrag.arbeidIPeriode = undefined;
    }

    if (cleanedNyFrilansoppdrag.frilansOppdragKategori === FrilanserOppdragType.FOSTERFORELDER) {
        cleanedNyFrilansoppdrag.normalarbeidstid = undefined;
        cleanedNyFrilansoppdrag.arbeidIPeriode = undefined;
        cleanedNyFrilansoppdrag.styremedlemHeleInntekt = undefined;
    }

    if (cleanedNyFrilansoppdrag.normalarbeidstid) {
        cleanedNyFrilansoppdrag.normalarbeidstid = cleanupNormalarbeidstid(cleanedNyFrilansoppdrag.normalarbeidstid);
    }
    return cleanedNyFrilansoppdrag;
};

const cleanupSelvstendigArbeidssituasjon = (values: SelvstendigFormData): SelvstendigFormData => {
    const selvstendig: SelvstendigFormData = { ...values };

    if (selvstendig.harHattInntektSomSN === YesOrNo.NO) {
        selvstendig.virksomhet = undefined;
        selvstendig.arbeidsforhold = undefined;
    }
    if (selvstendig.arbeidsforhold && selvstendig.arbeidsforhold.normalarbeidstid) {
        selvstendig.arbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(
            selvstendig.arbeidsforhold.normalarbeidstid
        );
    }

    return selvstendig;
};

export const cleanupArbeidssituasjonStep = (formValues: SøknadFormValues): SøknadFormValues => {
    const values: SøknadFormValues = { ...formValues };

    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(cleanupAnsattArbeidsforhold);
    values.frilansoppdrag = values.frilansoppdrag.map(cleanupFrilansArbeidsforhold);
    values.nyfrilansoppdrag =
        values.erFrilanserIPeriode === YesOrNo.NO ? [] : values.nyfrilansoppdrag.map(cleanupNyFrilansArbeidsforhold);
    values.selvstendig = cleanupSelvstendigArbeidssituasjon(values.selvstendig);

    if (!visVernepliktSpørsmål(values)) {
        values.harVærtEllerErVernepliktig = undefined;
    }

    return values;
};
