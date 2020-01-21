import * as React from 'react';
import { YesOrNo } from 'common/types/YesOrNo';
import { useIntl } from 'react-intl';
import { RadioPanelGroupStyle } from 'common/form-components/radio-panel-group-base/RadioPanelGroupBase';
import intlHelper from 'common/utils/intlUtils';
import FormikRadioPanelGroup from '../../formik/formik-radio-panel-group/FormikRadioPanelGroup';
import { FormikValidationProps } from 'common/formik/FormikProps';

interface YesOrNoQuestionProps<T> {
    legend: string;
    name: T;
    includeDoNotKnowOption?: boolean;
    labels?: {
        [YesOrNo.YES]?: string;
        [YesOrNo.NO]?: string;
        [YesOrNo.DO_NOT_KNOW]?: string;
    };
    singleColumn?: boolean;
    helperText?: string;
    style?: RadioPanelGroupStyle;
}

function YesOrNoQuestion<T>({
    legend,
    name,
    includeDoNotKnowOption,
    validate,
    labels,
    style,
    singleColumn,
    helperText
}: YesOrNoQuestionProps<T> & FormikValidationProps) {
    const intl = useIntl();
    const {
        yes: yesLabel = intlHelper(intl, 'Ja'),
        no: noLabel = intlHelper(intl, 'Nei'),
        doNotKnow: doNotKnowLabel = intlHelper(intl, 'VetIkke')
    } = labels || {};
    return (
        <FormikRadioPanelGroup<T>
            legend={legend}
            name={name}
            radios={[
                { label: yesLabel, value: YesOrNo.YES, key: YesOrNo.YES },
                { label: noLabel, value: YesOrNo.NO, key: YesOrNo.NO },
                ...(includeDoNotKnowOption
                    ? [{ label: doNotKnowLabel, value: YesOrNo.DO_NOT_KNOW, key: YesOrNo.DO_NOT_KNOW }]
                    : [])
            ]}
            validate={validate}
            helperText={helperText}
            style={style}
            singleColumn={singleColumn}
        />
    );
}

export default YesOrNoQuestion;
