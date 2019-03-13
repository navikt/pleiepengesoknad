import * as React from 'react';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { Field } from '../../types/PleiepengesøknadFormData';
import { YesOrNo } from '../../types/YesOrNo';

interface YesOrNoQuestionProps {
    legend: string;
    name: Field;
    validate?: (value: YesOrNo) => undefined | string;
    helperText?: string;
}

const YesOrNoQuestion: React.FunctionComponent<YesOrNoQuestionProps> = ({ legend, name, validate, helperText }) => (
    <RadioPanelGroup
        legend={legend}
        name={name}
        radios={[{ label: 'Ja', value: YesOrNo.YES, key: 'ja' }, { label: 'Nei', value: YesOrNo.NO, key: 'nei' }]}
        validate={validate}
        helperText={helperText}
    />
);

export default YesOrNoQuestion;
