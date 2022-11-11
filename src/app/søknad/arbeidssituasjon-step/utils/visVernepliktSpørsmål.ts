import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SelvstendigFormData } from '../../../types/SelvstendigFormData';
import {
    ArbeidsforholdFormValues,
    ArbeidsforholdFrilanserMedOppdragFormValues,
} from '../../../types/ArbeidsforholdFormValues';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';
import { FrilanserOppdragIPeriodenApi } from '../../../types/søknad-api-data/frilansOppdragApiData';

export const visVernepliktSpørsmål = ({
    ansatt_arbeidsforhold,
    frilansoppdrag,
    nyfrilansoppdrag,
    selvstendig,
}: {
    ansatt_arbeidsforhold: ArbeidsforholdFormValues[];
    frilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues[];
    nyfrilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues[];
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
    if (nyfrilansoppdrag.length > 0) {
        return false;
    }

    /** Frilanser Registrerte */
    if (frilansoppdrag.length > 0) {
        if (frilansoppdrag.some((oppdrag) => oppdrag.frilansOppdragIPerioden === undefined)) {
            return false;
        }

        if (
            frilansoppdrag.some(
                (oppdrag) =>
                    oppdrag.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA ||
                    oppdrag.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN
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
