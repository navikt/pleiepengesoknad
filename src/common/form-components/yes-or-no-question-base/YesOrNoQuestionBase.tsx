import * as React from 'react';
import RadioPanelGroupBase from '../radio-panel-group-base/RadioPanelGroupBase';
import { YesOrNo } from 'common/types/YesOrNo';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';

interface YesOrNoQuestionProps {
    legend: string;
    name: string;
    checked: YesOrNo;
    feil?: SkjemaelementFeil;
    onChange: (answer: YesOrNo) => void;
}

const YesOrNoQuestionBase: React.FunctionComponent<YesOrNoQuestionProps> = ({
    legend,
    name,
    checked,
    feil,
    onChange
}) => (
    <RadioPanelGroupBase
        legend={legend}
        feil={feil}
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
