import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { StønadGodtgjørelseFormData } from 'app/types/StønadGodtgjørelseFormData';
import { ArbeidsforholdFormValues, NormalarbeidstidFormValues } from '../../../types/ArbeidsforholdFormValues';
import { FrilansFormData, FrilansTyper } from '../../../types/FrilansFormData';
import { SelvstendigFormData } from '../../../types/SelvstendigFormData';
import { SøknadFormValues } from '../../../types/SøknadFormValues';
import { erFrilanserISøknadsperiode, kunStyrevervUtenNormalArbeidstid } from '../../../utils/frilanserUtils';
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

export const cleanupFrilansArbeidssituasjon = (søknadsperiode: DateRange, values: FrilansFormData): FrilansFormData => {
    const frilans: FrilansFormData = { ...values };
    if (erFrilanserISøknadsperiode(søknadsperiode, values) === false) {
        frilans.arbeidsforhold = undefined;
    }

    if (frilans.harHattInntektSomFrilanser === YesOrNo.NO) {
        /** Er ikke frilanser i perioden */
        frilans.frilansTyper = undefined;
        frilans.misterHonorarStyreverv = undefined;
        frilans.startdato = undefined;
        frilans.sluttdato = undefined;
        frilans.erFortsattFrilanser = undefined;
        frilans.arbeidsforhold = undefined;
    }
    if (frilans.harHattInntektSomFrilanser === YesOrNo.YES) {
        if (kunStyrevervUtenNormalArbeidstid(frilans.frilansTyper, frilans.misterHonorarStyreverv)) {
            frilans.startdato = undefined;
            frilans.arbeidsforhold = undefined;
        }
        if (!frilans.frilansTyper?.some((type) => type === FrilansTyper.STYREVERV)) {
            frilans.misterHonorarStyreverv = undefined;
        }

        if (
            !frilans.frilansTyper?.some((type) => type === FrilansTyper.FRILANS) &&
            frilans.arbeidsforhold?.arbeidIPeriode?.arbeiderIPerioden
        ) {
            frilans.arbeidsforhold.arbeidIPeriode.arbeiderIPerioden = undefined;
        }

        if (
            !frilans.frilansTyper?.some((type) => type === FrilansTyper.STYREVERV) &&
            frilans.arbeidsforhold?.arbeidIPeriode?.misterHonorarerFraVervIPerioden
        ) {
            frilans.arbeidsforhold.arbeidIPeriode.misterHonorarerFraVervIPerioden = undefined;
        }

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

const cleanupStønadGodtgjørelse = (values: StønadGodtgjørelseFormData): StønadGodtgjørelseFormData => {
    const stønadGodtgjørelse: StønadGodtgjørelseFormData = { ...values };
    if (stønadGodtgjørelse.mottarStønadGodtgjørelse === YesOrNo.NO) {
        stønadGodtgjørelse.mottarStønadGodtgjørelseIHelePeroden = undefined;
        stønadGodtgjørelse.starterUndeveis = undefined;
        stønadGodtgjørelse.startDato = undefined;
        stønadGodtgjørelse.slutterUnderveis = undefined;
        stønadGodtgjørelse.sluttDato = undefined;
    }

    if (stønadGodtgjørelse.mottarStønadGodtgjørelseIHelePeroden === YesOrNo.YES) {
        stønadGodtgjørelse.starterUndeveis = undefined;
        stønadGodtgjørelse.startDato = undefined;
        stønadGodtgjørelse.slutterUnderveis = undefined;
        stønadGodtgjørelse.sluttDato = undefined;
    }

    if (stønadGodtgjørelse.starterUndeveis === YesOrNo.NO) {
        stønadGodtgjørelse.startDato = undefined;
    }

    if (stønadGodtgjørelse.slutterUnderveis === YesOrNo.NO) {
        stønadGodtgjørelse.sluttDato = undefined;
    }

    return stønadGodtgjørelse;
};

export const cleanupArbeidssituasjonStep = (
    formValues: SøknadFormValues,
    søknadsperiode: DateRange
): SøknadFormValues => {
    const values: SøknadFormValues = { ...formValues };

    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(cleanupAnsattArbeidsforhold);
    values.frilans = cleanupFrilansArbeidssituasjon(søknadsperiode, values.frilans);
    values.selvstendig = cleanupSelvstendigArbeidssituasjon(values.selvstendig);
    values.stønadGodtgjørelse = cleanupStønadGodtgjørelse(values.stønadGodtgjørelse);

    if (!visVernepliktSpørsmål(values)) {
        values.harVærtEllerErVernepliktig = undefined;
    }

    return values;
};
