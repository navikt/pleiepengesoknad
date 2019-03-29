import * as React from 'react';
import { CheckboksPanel, CheckboksPanelProps, SkjemaGruppe } from 'nav-frontend-skjema';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import 'nav-frontend-skjema-style';
import './checkboxPanelGroupBase.less';

type CheckboxPanelBaseProps = CheckboksPanelProps & { key?: string };

interface CheckboxPanelGroupBaseProps {
    legend: string;
    checkboxes: CheckboxPanelBaseProps[];
    feil?: SkjemaelementFeil;
    helperText?: string;
}

const CheckboxPanelGroupBase = ({ legend, checkboxes, feil, helperText }: CheckboxPanelGroupBaseProps) => {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const ariaLabel = showHelperText ? 'Lukk hjelpetekst' : 'Åpne hjelpetekst';
    return (
        <SkjemaGruppe feil={feil}>
            <div className="checkboxPanelGroup skjemaelement">
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
                    <div className="checkboxPanelGroup--responsive">
                        {checkboxes.map(({ onChange, value, key, ...otherRadioProps }: CheckboxPanelBaseProps) => (
                            <div className="checkboxPanelWrapper" key={key}>
                                <CheckboksPanel onChange={onChange} value={value} {...otherRadioProps} />
                            </div>
                        ))}
                    </div>
                </fieldset>
            </div>
        </SkjemaGruppe>
    );
};

export default CheckboxPanelGroupBase;
