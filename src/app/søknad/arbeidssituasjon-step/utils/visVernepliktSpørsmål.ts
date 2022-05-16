import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SelvstendigFormData } from '../../../types/SelvstendigFormData';
import { ArbeidsforholdFormData } from '../../../types/ArbeidsforholdFormData';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';

export const visVernepliktSpørsmål = ({
    ansatt_arbeidsforhold,
    frilans,
    selvstendig,
}: {
    ansatt_arbeidsforhold: ArbeidsforholdFormData[];
    frilans: FrilansFormData;
    selvstendig: SelvstendigFormData;
}): boolean => {
    const { harHattInntektSomFrilanser } = frilans || {};

    /** Selvstendig næringsdrivende */
    if (
        isYesOrNoAnswered(selvstendig.harHattInntektSomSN) === false ||
        selvstendig.harHattInntektSomSN === YesOrNo.YES
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
