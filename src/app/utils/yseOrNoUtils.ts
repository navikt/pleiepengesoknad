import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const getYesOrNoAnswerFromBoolean = (flag?: boolean, useUnanswered?: boolean): YesOrNo | undefined => {
    switch (flag) {
        case true:
            return YesOrNo.YES;
        case false:
            return YesOrNo.NO;
        default:
            return useUnanswered === true ? YesOrNo.UNANSWERED : undefined;
    }
};
