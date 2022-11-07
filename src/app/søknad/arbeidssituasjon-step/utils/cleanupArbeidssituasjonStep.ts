import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilanserMedOppdragFormValues,
    NormalarbeidstidFormValues,
    ArbeidsforholdFrilanserNyFormValues,
} from '../../../types/ArbeidsforholdFormValues';
import { FrilansFormData, FrilansOppdragKategori, FrilansOppdragSvar } from '../../../types/FrilansFormData';
import { SelvstendigFormData } from '../../../types/SelvstendigFormData';
import { SøknadFormValues } from '../../../types/SøknadFormValues';
import { erFrilanserISøknadsperiode } from '../../../utils/frilanserUtils';
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
    const cleanedArbeidsforhold = { ...arbeidsforhold };
    if (cleanedArbeidsforhold.frilansOppdragIPerioden === FrilansOppdragSvar.NEI) {
        cleanedArbeidsforhold.sluttdato = undefined;
        cleanedArbeidsforhold.normalarbeidstid = undefined;
        cleanedArbeidsforhold.frilansOppdragKategori = undefined;
        cleanedArbeidsforhold.styremedlemHeleInntekt = undefined;
        cleanedArbeidsforhold.arbeidIPeriode = undefined;
    }
    if (cleanedArbeidsforhold.frilansOppdragIPerioden === FrilansOppdragSvar.JA) {
        cleanedArbeidsforhold.sluttdato = undefined;
    }

    if (cleanedArbeidsforhold.frilansOppdragKategori !== FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV) {
        cleanedArbeidsforhold.styremedlemHeleInntekt = undefined;
    }

    if (cleanedArbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.FOSTERFORELDER) {
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
    arbeidsforhold: ArbeidsforholdFrilanserNyFormValues
): ArbeidsforholdFrilanserNyFormValues => {
    const cleanedArbeidsforhold = { ...arbeidsforhold };

    if (cleanedArbeidsforhold.sluttet !== true) {
        cleanedArbeidsforhold.sluttdato = undefined;
    }

    if (cleanedArbeidsforhold.frilansOppdragKategori !== FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV) {
        cleanedArbeidsforhold.styremedlemHeleInntekt = undefined;
    }

    if (cleanedArbeidsforhold.frilansOppdragKategori === FrilansOppdragKategori.FOSTERFORELDER) {
        cleanedArbeidsforhold.normalarbeidstid = undefined;
        cleanedArbeidsforhold.arbeidIPeriode = undefined;
        cleanedArbeidsforhold.styremedlemHeleInntekt = undefined;
    }

    if (cleanedArbeidsforhold.normalarbeidstid) {
        cleanedArbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(cleanedArbeidsforhold.normalarbeidstid);
    }
    return cleanedArbeidsforhold;
};

export const cleanupFrilansArbeidssituasjon = (søknadsperiode: DateRange, values: FrilansFormData): FrilansFormData => {
    const frilans: FrilansFormData = { ...values };
    if (erFrilanserISøknadsperiode(søknadsperiode, values) === false) {
        frilans.arbeidsforhold = undefined;
    }

    if (frilans.harHattInntektSomFrilanser === YesOrNo.NO) {
        /** Er ikke frilanser i perioden */
        frilans.erFortsattFrilanser = undefined;
        frilans.startdato = undefined;
        frilans.sluttdato = undefined;
        frilans.arbeidsforhold = undefined;
    }
    if (frilans.harHattInntektSomFrilanser === YesOrNo.YES) {
        /** Er frilanser i perioden */
        if (frilans.erFortsattFrilanser === YesOrNo.YES) {
            frilans.sluttdato = undefined;
        }
    }

    if (frilans.arbeidsforhold && frilans.arbeidsforhold.normalarbeidstid) {
        frilans.arbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(frilans.arbeidsforhold.normalarbeidstid);
    }

    return frilans;
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

export const cleanupArbeidssituasjonStep = (
    formValues: SøknadFormValues,
    søknadsperiode: DateRange
): SøknadFormValues => {
    const values: SøknadFormValues = { ...formValues };

    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(cleanupAnsattArbeidsforhold);
    values.frilansoppdrag = values.frilansoppdrag.map(cleanupFrilansArbeidsforhold);
    values.nyfrilansoppdrag =
        values.erFrilanserIPeriode === YesOrNo.NO ? [] : values.nyfrilansoppdrag.map(cleanupNyFrilansArbeidsforhold);

    values.frilans = cleanupFrilansArbeidssituasjon(søknadsperiode, values.frilans);
    values.selvstendig = cleanupSelvstendigArbeidssituasjon(values.selvstendig);

    if (!visVernepliktSpørsmål(values)) {
        values.harVærtEllerErVernepliktig = undefined;
    }

    return values;
};
