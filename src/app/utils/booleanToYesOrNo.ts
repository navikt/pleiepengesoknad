import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const booleanToYesOrNo = (value: boolean): YesOrNo =>
    value !== undefined && value === true ? YesOrNo.YES : YesOrNo.NO;

export const booleanToYesOrNoOrUnanswered = (value?: boolean): YesOrNo =>
    value === undefined ? YesOrNo.UNANSWERED : value === true ? YesOrNo.YES : YesOrNo.NO;
