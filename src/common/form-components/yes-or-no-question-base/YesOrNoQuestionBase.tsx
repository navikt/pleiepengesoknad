import * as React from 'react';
import RadioPanelGroupBase from '../radio-panel-group-base/RadioPanelGroupBase';
import { YesOrNo } from 'common/types/YesOrNo';

interface YesOrNoQuestionProps {
    legend: string;
    name: string;
    checked: YesOrNo;
    onChange: (answer: YesOrNo) => void;
}

const YesOrNoQuestionBase: React.FunctionComponent<YesOrNoQuestionProps> = ({ legend, name, checked, onChange }) => (
    <RadioPanelGroupBase
        legend={legend}
        radios={[
            {
                name,
                label: 'Ja',
                value: YesOrNo.YES,
                key: 'ja',
                checked: checked === YesOrNo.YES,
                onChange: () => onChange(YesOrNo.YES)
            },
            {
                name,
                label: 'Nei',
                value: YesOrNo.NO,
                key: 'nei',
                checked: checked === YesOrNo.NO,
                onChange: () => onChange(YesOrNo.NO)
            }
        ]}
    />
);

export default YesOrNoQuestionBase;
