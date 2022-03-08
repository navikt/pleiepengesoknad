import { Arbeidsforhold } from './../../../types/Arbeidsforhold';
import { FrilansFormDataPart, Arbeidsgiver } from './../../../types/SøknadFormData';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { visVernepliktSpørsmål } from './visVernepliktSpørsmål';
import { erFrilanserISøknadsperiode, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';

export const cleanupAnsattArbeidsforhold = (arbeidsforhold: Arbeidsforhold): Arbeidsforhold => {
    const cleanedArbeidsforhold = { ...arbeidsforhold };

    if (cleanedArbeidsforhold.erAnsatt === YesOrNo.YES) {
        cleanedArbeidsforhold.sluttetFørSøknadsperiode = undefined;
    }
    if (
        cleanedArbeidsforhold.erAnsatt === YesOrNo.NO &&
        cleanedArbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.YES
    ) {
        cleanedArbeidsforhold.jobberNormaltTimer = undefined;
        cleanedArbeidsforhold.harFraværIPeriode = undefined;
    }
    if (
        cleanedArbeidsforhold.harFraværIPeriode === undefined ||
        cleanedArbeidsforhold.harFraværIPeriode === YesOrNo.NO
    ) {
        cleanedArbeidsforhold.arbeidIPeriode = undefined;
    }
    return cleanedArbeidsforhold;
};

export const cleanupFrilansArbeidssituasjon = (
    søknadsperiode: DateRange,
    values: FrilansFormDataPart,
    frilansoppdrag: Arbeidsgiver[] | undefined
): FrilansFormDataPart => {
    const frilans: FrilansFormDataPart = { ...values };
    if (erFrilanserISøknadsperiode(søknadsperiode, values, frilansoppdrag) === false) {
        frilans.arbeidsforhold = undefined;
    }

    if (harFrilansoppdrag(frilansoppdrag)) {
        frilans.harHattInntektSomFrilanser = undefined;
        if (frilans.jobberFortsattSomFrilans === YesOrNo.YES) {
            frilans.sluttdato = undefined;
        }
    } else {
        /** Er ikke frilanser i perioden */
        if (frilans.harHattInntektSomFrilanser === YesOrNo.NO) {
            frilans.jobberFortsattSomFrilans = undefined;
            frilans.startdato = undefined;
            frilans.sluttdato = undefined;
        }

        if (frilans.harHattInntektSomFrilanser === YesOrNo.YES) {
            if (frilans.jobberFortsattSomFrilans === YesOrNo.YES) {
                frilans.sluttdato = undefined;
            }
        }
    }

    return frilans;
};

export const cleanupArbeidssituasjonStep = (
    formValues: SøknadFormData,
    søknadsperiode: DateRange,
    frilansoppdrag: Arbeidsgiver[] | undefined
): SøknadFormData => {
    const values: SøknadFormData = { ...formValues };

    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(cleanupAnsattArbeidsforhold);

    values.frilans = cleanupFrilansArbeidssituasjon(søknadsperiode, values.frilans, frilansoppdrag);

    if (values.selvstendig_harHattInntektSomSN === YesOrNo.NO) {
        values.selvstendig_virksomhet = undefined;
        values.selvstendig_arbeidsforhold = undefined;
    }

    if (!visVernepliktSpørsmål(values)) {
        values.harVærtEllerErVernepliktig = undefined;
    }

    if (values.mottarAndreYtelser === YesOrNo.NO) {
        values.andreYtelser = [];
    }

    return values;
};
