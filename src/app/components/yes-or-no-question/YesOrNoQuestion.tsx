import * as React from 'react';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { Field } from '../../types/PleiepengesøknadFormData';
import { YesOrNo } from '../../types/YesOrNo';

interface YesOrNoQuestionProps {
    legend: string;
    name: Field;
    validate?: () => undefined | string;
}

const YesOrNoQuestion: React.FunctionComponent<YesOrNoQuestionProps> = ({ legend, name }) => (
    <RadioPanelGroup
        legend={legend}
        name={name}
        radios={[{ label: 'Ja', value: YesOrNo.YES }, { label: 'Nei', value: YesOrNo.NO }]}
    />
);

export default YesOrNoQuestion;
