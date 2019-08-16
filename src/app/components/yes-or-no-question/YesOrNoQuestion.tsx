import * as React from 'react';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { Field } from '../../types/PleiepengesøknadFormData';
import { YesOrNo } from '../../types/YesOrNo';
import { FormikValidationProps } from 'app/types/FormikProps';
import { injectIntl } from 'react-intl';
import { RadioPanelGroupStyle } from '../radio-panel-group-base/RadioPanelGroupBase';

interface YesOrNoQuestionProps {
    legend: string;
    name: Field;
    helperText?: string;
    style?: RadioPanelGroupStyle;
}

const YesOrNoQuestion: React.FunctionComponent<YesOrNoQuestionProps & FormikValidationProps> = ({
    legend,
    name,
    validate,
    style,
    helperText
}) => (
    <RadioPanelGroup
        legend={legend}
        name={name}
        radios={[{ label: 'Ja', value: YesOrNo.YES, key: 'ja' }, { label: 'Nei', value: YesOrNo.NO, key: 'nei' }]}
        validate={validate}
        helperText={helperText}
        style={style}
    />
);

export default injectIntl(YesOrNoQuestion);
