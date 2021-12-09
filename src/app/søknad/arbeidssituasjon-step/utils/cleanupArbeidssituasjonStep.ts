import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { visVernepliktSpørsmål } from './visVernepliktSpørsmål';

export const cleanupArbeidssituasjonStep = (formValues: SøknadFormData): SøknadFormData => {
    const values: SøknadFormData = { ...formValues };

    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map((a) => {
        const cleanedArbeidsforhold = { ...a };
        if (cleanedArbeidsforhold.erAnsatt === YesOrNo.YES) {
            cleanedArbeidsforhold.sluttetFørSøknadsperiode = undefined;
        }
        if (
            cleanedArbeidsforhold.erAnsatt === YesOrNo.NO &&
            cleanedArbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.YES
        ) {
            cleanedArbeidsforhold.jobberNormaltTimer = undefined;
        }
        return cleanedArbeidsforhold;
    });
    if (values.mottarAndreYtelser === YesOrNo.NO) {
        values.andreYtelser = [];
    }
    if (values.frilans_harHattInntektSomFrilanser !== YesOrNo.YES) {
        values.frilans_jobberFortsattSomFrilans = undefined;
        values.frilans_startdato = undefined;
        values.frilans_arbeidsforhold = undefined;
    }
    if (values.frilans_jobberFortsattSomFrilans !== YesOrNo.NO) {
        values.frilans_sluttdato = undefined;
    }
    if (values.selvstendig_harHattInntektSomSN === YesOrNo.NO) {
        values.selvstendig_virksomhet = undefined;
        values.selvstendig_arbeidsforhold = undefined;
    }
    if (!visVernepliktSpørsmål(values)) {
        values.harVærtEllerErVernepliktig = undefined;
    }

    return values;
};
