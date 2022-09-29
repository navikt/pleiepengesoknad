import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { removeDurationWeekdaysWithNoDuration } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver } from '../../../types';
import { ArbeidsforholdFormData, NormalarbeidstidFormData } from '../../../types/ArbeidsforholdFormData';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { SelvstendigFormData } from '../../../types/SelvstendigFormData';
import { SøknadFormValues } from '../../../types/SøknadFormValues';
import { erFrilanserISøknadsperiode, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { visVernepliktSpørsmål } from './visVernepliktSpørsmål';

const cleanupNormalarbeidstid = (
    {
        erLiktSomForrigeSøknad,
        erLikeMangeTimerHverUke,
        timerFasteUkedager,
        erFasteUkedager,
        timerPerUke,
        arbeiderFastHelg,
        arbeiderHeltid,
    }: NormalarbeidstidFormData,
    erFrilanserEllerSN: boolean /** Skal kun oppgi informasjon om timer i uken */
): NormalarbeidstidFormData => {
    if (erFrilanserEllerSN) {
        return {
            erLikeMangeTimerHverUke: YesOrNo.YES,
            timerPerUke,
        };
    }

    if (erLiktSomForrigeSøknad === YesOrNo.YES) {
        return {
            erLiktSomForrigeSøknad,
            timerPerUke,
        };
    }
    if (arbeiderHeltid === YesOrNo.NO) {
        return {
            erLiktSomForrigeSøknad,
            arbeiderHeltid,
            timerPerUke,
        };
    }
    if (arbeiderFastHelg === YesOrNo.YES) {
        return {
            erLiktSomForrigeSøknad,
            arbeiderHeltid,
            arbeiderFastHelg,
            timerPerUke,
        };
    }
    if (erLikeMangeTimerHverUke === YesOrNo.NO) {
        return {
            erLiktSomForrigeSøknad,
            arbeiderHeltid,
            arbeiderFastHelg,
            erLikeMangeTimerHverUke,
            timerPerUke,
        };
    }
    if (erFasteUkedager === YesOrNo.YES) {
        return {
            erLiktSomForrigeSøknad,
            arbeiderHeltid,
            arbeiderFastHelg,
            erLikeMangeTimerHverUke,
            erFasteUkedager,
            timerFasteUkedager: timerFasteUkedager
                ? removeDurationWeekdaysWithNoDuration(timerFasteUkedager)
                : undefined,
        };
    }
    return {
        erLiktSomForrigeSøknad,
        arbeiderHeltid,
        arbeiderFastHelg,
        erLikeMangeTimerHverUke,
        erFasteUkedager,
        timerPerUke,
    };
};

export const cleanupAnsattArbeidsforhold = (arbeidsforhold: ArbeidsforholdFormData): ArbeidsforholdFormData => {
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
        cleanedArbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(cleanedArbeidsforhold.normalarbeidstid, false);
    }
    return cleanedArbeidsforhold;
};

export const cleanupFrilansArbeidssituasjon = (
    søknadsperiode: DateRange,
    values: FrilansFormData,
    frilansoppdrag: Arbeidsgiver[] | undefined
): FrilansFormData => {
    const frilans: FrilansFormData = { ...values };
    if (erFrilanserISøknadsperiode(søknadsperiode, values, frilansoppdrag) === false) {
        frilans.arbeidsforhold = undefined;
    }

    if (harFrilansoppdrag(frilansoppdrag)) {
        frilans.harHattInntektSomFrilanser = undefined;
        if (frilans.erFortsattFrilanser === YesOrNo.YES) {
            frilans.sluttdato = undefined;
        }
    } else {
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
    }
    if (frilans.arbeidsforhold && frilans.arbeidsforhold.normalarbeidstid) {
        frilans.arbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(
            frilans.arbeidsforhold.normalarbeidstid,
            true
        );
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
            selvstendig.arbeidsforhold.normalarbeidstid,
            true
        );
    }

    return selvstendig;
};

export const cleanupArbeidssituasjonStep = (
    formValues: SøknadFormValues,
    søknadsperiode: DateRange,
    frilansoppdrag: Arbeidsgiver[] | undefined
): SøknadFormValues => {
    const values: SøknadFormValues = { ...formValues };

    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(cleanupAnsattArbeidsforhold);
    values.frilans = cleanupFrilansArbeidssituasjon(søknadsperiode, values.frilans, frilansoppdrag);
    values.selvstendig = cleanupSelvstendigArbeidssituasjon(values.selvstendig);

    if (!visVernepliktSpørsmål(values)) {
        values.harVærtEllerErVernepliktig = undefined;
    }

    return values;
};
