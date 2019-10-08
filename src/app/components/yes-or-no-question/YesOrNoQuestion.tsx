import * as React from 'react';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { Field } from '../../types/PleiepengesøknadFormData';
import { YesOrNo } from '../../types/YesOrNo';
import { FormikValidationProps } from 'app/types/FormikProps';
import { injectIntl } from 'react-intl';
import { RadioPanelGroupStyle } from '../radio-panel-group-base/RadioPanelGroupBase';
import intlHelper from '../../utils/intlUtils';

interface YesOrNoQuestionProps {
    legend: string;
    name: Field;
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

const YesOrNoQuestion: React.FunctionComponent<YesOrNoQuestionProps & FormikValidationProps> = ({
    legend,
    name,
    intl,
    includeDoNotKnowOption,
    validate,
    labels,
    style,
    singleColumn,
    helperText
}) => {
    const {
        yes: yesLabel = intlHelper(intl, 'Ja'),
        no: noLabel = intlHelper(intl, 'Nei'),
        doNotKnow: doNotKnowLabel = intlHelper(intl, 'VetIkke')
    } = labels || {};
    return (
        <RadioPanelGroup
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
};

export default injectIntl(YesOrNoQuestion);
