import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Arbeidsforhold } from '../../../types/Arbeidsforhold';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';

export const visVernepliktSpørsmål = ({
    ansatt_arbeidsforhold,
    frilans,
    selvstendig_harHattInntektSomSN,
}: {
    ansatt_arbeidsforhold: Arbeidsforhold[];
    frilans: FrilansFormData;
    selvstendig_harHattInntektSomSN?: YesOrNo;
}): boolean => {
    const { harHattInntektSomFrilanser } = frilans || {};

    /** Selvstendig næringsdrivende */
    if (
        isYesOrNoAnswered(selvstendig_harHattInntektSomSN) === false ||
        selvstendig_harHattInntektSomSN === YesOrNo.YES
    ) {
        return false;
    }
    /** Frilanser */
    if (
        isYesOrNoAnswered(frilans?.harHattInntektSomFrilanser) === false ||
        frilans?.harHattInntektSomFrilanser === YesOrNo.YES
    ) {
        return false;
    }
    if (harHattInntektSomFrilanser !== YesOrNo.NO) {
        return false;
    }

    /** Arbeidsgivere */
    if (ansatt_arbeidsforhold.length > 0) {
        if (ansatt_arbeidsforhold.some((a) => isYesOrNoAnswered(a.erAnsatt) === false)) {
            return false;
        }
        if (ansatt_arbeidsforhold.some((a) => a.erAnsatt === YesOrNo.YES)) {
            return false;
        }
        return (
            ansatt_arbeidsforhold.some(
                (a) => a.erAnsatt === YesOrNo.NO && a.sluttetFørSøknadsperiode !== YesOrNo.YES
            ) === false
        );
    }
    return true;
};
