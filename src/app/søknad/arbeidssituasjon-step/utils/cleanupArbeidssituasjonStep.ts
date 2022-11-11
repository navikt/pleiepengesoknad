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
    //TODO erFrilans i søknadsperiode hvis nødvendig
    const cleanedArbeidsforhold = { ...arbeidsforhold };
    if (cleanedArbeidsforhold.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.NEI) {
        cleanedArbeidsforhold.sluttdato = undefined;
        cleanedArbeidsforhold.normalarbeidstid = undefined;
        cleanedArbeidsforhold.frilansOppdragKategori = undefined;
        cleanedArbeidsforhold.styremedlemHeleInntekt = undefined;
        cleanedArbeidsforhold.arbeidIPeriode = undefined;
    }
    if (cleanedArbeidsforhold.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA) {
        cleanedArbeidsforhold.sluttdato = undefined;
    }

    if (cleanedArbeidsforhold.frilansOppdragKategori !== FrilanserOppdragType.STYREMEDLEM_ELLER_VERV) {
        cleanedArbeidsforhold.styremedlemHeleInntekt = undefined;
    }

    if (cleanedArbeidsforhold.frilansOppdragKategori === FrilanserOppdragType.FOSTERFORELDER) {
        cleanedArbeidsforhold.normalarbeidstid = undefined;
        cleanedArbeidsforhold.arbeidIPeriode = undefined;
        cleanedArbeidsforhold.styremedlemHeleInntekt = undefined;
    }

    if (cleanedArbeidsforhold.normalarbeidstid) {
        cleanedArbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(cleanedArbeidsforhold.normalarbeidstid);
    }
    return cleanedArbeidsforhold;
};

export const cleanupNyFrilansArbeidsforhold = (
    nyFrilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues
): ArbeidsforholdFrilanserMedOppdragFormValues => {
    //TODO erFrilans i søknadsperiode hvis nødvendig
    // HUSK [SøknadFormField.erFrilanserIPeriode]
    const cleanedNyFrilansoppdrag = { ...nyFrilansoppdrag };

    if (cleanedNyFrilansoppdrag.sluttet !== true) {
        cleanedNyFrilansoppdrag.arbeidsgiver.ansattTom = undefined;
    }

    if (cleanedNyFrilansoppdrag.frilansOppdragKategori !== FrilanserOppdragType.STYREMEDLEM_ELLER_VERV) {
        cleanedNyFrilansoppdrag.styremedlemHeleInntekt = undefined;
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
