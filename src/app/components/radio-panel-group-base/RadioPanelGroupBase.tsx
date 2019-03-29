import * as React from 'react';
import { RadioPanel, RadioPanelProps, SkjemaGruppe } from 'nav-frontend-skjema';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import 'nav-frontend-skjema-style';
import './radioPanelGroup.less';

type RadioPanelBaseProps = RadioPanelProps & { key?: string };

interface RadioPanelGroupBaseProps {
    legend: string;
    radios: RadioPanelBaseProps[];
    feil?: SkjemaelementFeil;
    helperText?: string;
}

const RadioPanelGroupBase = ({ legend, radios, feil, helperText }: RadioPanelGroupBaseProps) => {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const ariaLabel = showHelperText ? 'Lukk hjelpetekst' : 'Åpne hjelpetekst';
    return (
        <SkjemaGruppe feil={feil}>
            <div className="radioPanelGruppe skjemaelement">
                <fieldset className="skjema__fieldset">
                    <legend className="skjema__legend">
                        {legend}
                        {helperText && (
                            <>
                                <HelperTextButton
                                    onClick={() => setShowHelperText(!showHelperText)}
                                    ariaLabel={ariaLabel}
                                    ariaPressed={showHelperText}
                                />
                                {showHelperText && <HelperTextPanel>{helperText}</HelperTextPanel>}
                            </>
                        )}
                    </legend>
                    <div className="radioPanelGroup--responsive">
                        {radios.map(({ onChange, value, key, ...otherRadioProps }: RadioPanelBaseProps) => (
                            <div className="radioPanelWrapper" key={key}>
                                <RadioPanel onChange={onChange} value={value} {...otherRadioProps} />
                            </div>
                        ))}
                    </div>
                </fieldset>
            </div>
        </SkjemaGruppe>
    );
};

export default RadioPanelGroupBase;
