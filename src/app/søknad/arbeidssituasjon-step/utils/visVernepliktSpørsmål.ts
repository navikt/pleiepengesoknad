import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SelvstendigFormData } from '../../../types/SelvstendigFormData';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilansoppdragFormValues,
} from '../../../types/ArbeidsforholdFormValues';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';
import { FrilansoppdragIPeriodenApi } from '../../../types/søknad-api-data/frilansoppdragApiData';

export const visVernepliktSpørsmål = ({
    ansatt_arbeidsforhold,
    frilansoppdrag,
    nyttFrilansoppdrag,
    selvstendig,
}: {
    ansatt_arbeidsforhold: ArbeidsforholdFormValues[];
    frilansoppdrag: ArbeidsforholdFrilansoppdragFormValues[];
    nyttFrilansoppdrag: ArbeidsforholdFrilansoppdragFormValues[];
    selvstendig: SelvstendigFormData;
}): boolean => {
    /** Selvstendig næringsdrivende */
    if (
        isYesOrNoAnswered(selvstendig.harHattInntektSomSN) === false ||
        selvstendig.harHattInntektSomSN === YesOrNo.YES
    ) {
        return false;
    }

    /** Frilanser lagt til */
    if (nyttFrilansoppdrag.length > 0) {
        return false;
    }

    /** Frilanser Registrerte */
    if (frilansoppdrag.length > 0) {
        if (frilansoppdrag.some((oppdrag) => oppdrag.frilansoppdragIPerioden === undefined)) {
            return false;
        }

        if (
            frilansoppdrag.some(
                (oppdrag) =>
                    oppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA ||
                    oppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN
            )
        ) {
            return false;
        }
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
