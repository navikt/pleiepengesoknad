import * as React from 'react';
import { Fieldset, RadioPanel, RadioPanelProps, SkjemaGruppe } from 'nav-frontend-skjema';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import 'nav-frontend-skjema-style';
import './radioPanelGroup.less';

interface RadioPanelGroupBaseProps {
    legend: string;
    radios: RadioPanelProps[];
    feil?: SkjemaelementFeil;
}

const RadioPanelGroupBase = ({ legend, radios, feil }: RadioPanelGroupBaseProps) => (
    <div className="radioPanelGruppe skjemaelement">
        <Fieldset legend={legend}>
            <SkjemaGruppe className="radioPanelGroup--responsive" feil={feil}>
                {radios.map(({ onChange, value, ...otherRadioProps }: RadioPanelProps) => (
                    <div className="radioPanelWrapper" key={value}>
                        <RadioPanel onChange={onChange} value={value} {...otherRadioProps} />
                    </div>
                ))}
            </SkjemaGruppe>
        </Fieldset>
    </div>
);

export default RadioPanelGroupBase;
