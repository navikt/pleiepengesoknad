import * as React from 'react';
import { Fieldset, CheckboksPanel, CheckboksPanelProps, SkjemaGruppe } from 'nav-frontend-skjema';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import 'nav-frontend-skjema-style';
import './checkboxPanelGroupBase.less';

type CheckboxPanelBaseProps = CheckboksPanelProps & { key?: string };

interface CheckboxPanelGroupBaseProps {
    legend: string;
    checkboxes: CheckboxPanelBaseProps[];
    feil?: SkjemaelementFeil;
}

const CheckboxPanelGroupBase = ({ legend, checkboxes, feil }: CheckboxPanelGroupBaseProps) => (
    <div className="checkboxPanelGroup skjemaelement">
        <Fieldset legend={legend}>
            <SkjemaGruppe className="checkboxPanelGroup--responsive" feil={feil}>
                {checkboxes.map(({ onChange, value, key, ...otherRadioProps }: CheckboxPanelBaseProps) => (
                    <div className="checkboxPanelWrapper" key={key}>
                        <CheckboksPanel onChange={onChange} value={value} {...otherRadioProps} />
                    </div>
                ))}
            </SkjemaGruppe>
        </Fieldset>
    </div>
);

export default CheckboxPanelGroupBase;
