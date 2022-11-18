import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { FrilansoppdragIPeriodenApi } from '../../../types/søknad-api-data/frilansoppdragApiData';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilansoppdragFormValues,
    NormalarbeidstidFormValues,
} from '../../../types/ArbeidsforholdFormValues';
import { FrilansoppdragType } from '../../../types/FrilansoppdragFormData';
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
    arbeidsforhold: ArbeidsforholdFrilansoppdragFormValues
): ArbeidsforholdFrilansoppdragFormValues => {
    const cleanedFrilansoppdrag = { ...arbeidsforhold };
    if (cleanedFrilansoppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.NEI) {
        cleanedFrilansoppdrag.sluttdato = undefined;
        cleanedFrilansoppdrag.normalarbeidstid = undefined;
        cleanedFrilansoppdrag.frilansoppdragKategori = undefined;
        cleanedFrilansoppdrag.styremedlemHeleInntekt = undefined;
        cleanedFrilansoppdrag.arbeidIPeriode = undefined;
    }
    if (cleanedFrilansoppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA) {
        cleanedFrilansoppdrag.sluttdato = undefined;
    }

    if (cleanedFrilansoppdrag.frilansoppdragKategori !== FrilansoppdragType.STYREMEDLEM_ELLER_VERV) {
        cleanedFrilansoppdrag.styremedlemHeleInntekt = undefined;
    }
    if (
        cleanedFrilansoppdrag.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV &&
        cleanedFrilansoppdrag.styremedlemHeleInntekt === YesOrNo.YES
    ) {
        cleanedFrilansoppdrag.normalarbeidstid = undefined;
        cleanedFrilansoppdrag.arbeidIPeriode = undefined;
    }
    if (cleanedFrilansoppdrag.frilansoppdragKategori === FrilansoppdragType.FOSTERFORELDER) {
        cleanedFrilansoppdrag.normalarbeidstid = undefined;
        cleanedFrilansoppdrag.arbeidIPeriode = undefined;
        cleanedFrilansoppdrag.styremedlemHeleInntekt = undefined;
    }

    if (cleanedFrilansoppdrag.normalarbeidstid) {
        cleanedFrilansoppdrag.normalarbeidstid = cleanupNormalarbeidstid(cleanedFrilansoppdrag.normalarbeidstid);
    }
    return cleanedFrilansoppdrag;
};

export const cleanupNyttFrilansoppdragArbeidsforhold = (
    nyttFrilansoppdrag: ArbeidsforholdFrilansoppdragFormValues
): ArbeidsforholdFrilansoppdragFormValues => {
    const cleanedNyttFrilansoppdrag = { ...nyttFrilansoppdrag };

    if (cleanedNyttFrilansoppdrag.sluttet !== true) {
        cleanedNyttFrilansoppdrag.arbeidsgiver.ansattTom = undefined;
    }

    if (cleanedNyttFrilansoppdrag.frilansoppdragKategori !== FrilansoppdragType.STYREMEDLEM_ELLER_VERV) {
        cleanedNyttFrilansoppdrag.styremedlemHeleInntekt = undefined;
    }

    if (
        cleanedNyttFrilansoppdrag.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV &&
        cleanedNyttFrilansoppdrag.styremedlemHeleInntekt === YesOrNo.YES
    ) {
        cleanedNyttFrilansoppdrag.normalarbeidstid = undefined;
        cleanedNyttFrilansoppdrag.arbeidIPeriode = undefined;
    }

    if (cleanedNyttFrilansoppdrag.frilansoppdragKategori === FrilansoppdragType.FOSTERFORELDER) {
        cleanedNyttFrilansoppdrag.normalarbeidstid = undefined;
        cleanedNyttFrilansoppdrag.arbeidIPeriode = undefined;
        cleanedNyttFrilansoppdrag.styremedlemHeleInntekt = undefined;
    }

    if (cleanedNyttFrilansoppdrag.normalarbeidstid) {
        cleanedNyttFrilansoppdrag.normalarbeidstid = cleanupNormalarbeidstid(
            cleanedNyttFrilansoppdrag.normalarbeidstid
        );
    }
    return cleanedNyttFrilansoppdrag;
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
    values.nyttFrilansoppdrag =
        values.erFrilanserIPeriode === YesOrNo.NO
            ? []
            : values.nyttFrilansoppdrag.map(cleanupNyttFrilansoppdragArbeidsforhold);
    values.selvstendig = cleanupSelvstendigArbeidssituasjon(values.selvstendig);

    if (!visVernepliktSpørsmål(values)) {
        values.harVærtEllerErVernepliktig = undefined;
    }

    return values;
};
