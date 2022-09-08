import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODurationToDecimalDuration } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidFormData } from '../../types/ArbeidsforholdFormData';
import { NormalarbeidstidApiData } from '../../types/søknad-api-data/normalarbeidstidApiData';
import { mapTimerFasteDagerToDurationWeekdays } from './extractFormValuesUtils';

export const mapNormalarbeidstidApiDataToFormValues = (
    normalarbeidstid?: NormalarbeidstidApiData
): NormalarbeidstidFormData | undefined => {
    if (!normalarbeidstid) {
        return undefined;
    }
    if (normalarbeidstid.erLiktHverUke) {
        return {
            erLikeMangeTimerHverUke: YesOrNo.YES,
            arbeiderFastHelg: YesOrNo.NO,
            arbeiderHeltid: YesOrNo.YES,
            erFasteUkedager: YesOrNo.YES,
            timerFasteUkedager: mapTimerFasteDagerToDurationWeekdays(normalarbeidstid.timerFasteDager),
        };
    }
    return {
        erLikeMangeTimerHverUke: YesOrNo.NO,
        timerPerUke: `${ISODurationToDecimalDuration(normalarbeidstid.timerPerUkeISnitt)}`.replace('.', ','),
        /** WhatTodo
         * lage støtte for at bruker får spørsmål om snitt er det samme

         */
    };
};
