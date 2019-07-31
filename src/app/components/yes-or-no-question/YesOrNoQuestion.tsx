import * as React from 'react';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { Field } from '../../types/PleiepengesøknadFormData';
import { YesOrNo } from '../../types/YesOrNo';
import { FormikIntlValidationProps } from 'app/types/FormikProps';
import { injectIntl } from 'react-intl';

interface YesOrNoQuestionProps {
    legend: string;
    name: Field;
    helperText?: string;
}

const YesOrNoQuestion: React.FunctionComponent<YesOrNoQuestionProps & FormikIntlValidationProps> = ({
    legend,
    name,
    validate,
    helperText
}) => (
    <RadioPanelGroup
        legend={legend}
        name={name}
        radios={[{ label: 'Ja', value: YesOrNo.YES, key: 'ja' }, { label: 'Nei', value: YesOrNo.NO, key: 'nei' }]}
        validate={validate}
        helperText={helperText}
    />
);

export default injectIntl(YesOrNoQuestion);
