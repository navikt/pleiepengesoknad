import * as React from 'react';
import { RadioPanel, RadioPanelProps, SkjemaGruppe, Radio } from 'nav-frontend-skjema';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import bemUtils from 'app/utils/bemUtils';
import 'nav-frontend-skjema-style';
import './radioPanelGroup.less';

type RadioPanelBaseProps = RadioPanelProps & { key: string };

export type RadioPanelGroupStyle = 'panel' | 'radio';

interface RadioPanelGroupBaseProps {
    legend: string;
    radios: RadioPanelBaseProps[];
    feil?: SkjemaelementFeil;
    helperText?: string;
    style?: RadioPanelGroupStyle;
    singleColumn?: boolean;
    expandedContentRenderer?: () => React.ReactNode;
}

const bem = bemUtils('radioPanelGruppe');

const RadioPanelGroupBase = ({
    legend,
    radios,
    feil,
    helperText,
    expandedContentRenderer,
    style = 'panel',
    singleColumn = false,
    intl
}: RadioPanelGroupBaseProps & InjectedIntlProps) => {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const ariaLabel = intlHelper(intl, showHelperText ? 'hjelpetekst.skjul' : 'hjelpetekst.vis');
    return (
        <SkjemaGruppe feil={feil}>
            <div
                className={bem.classNames(
                    bem.block,
                    'skjemaelement',
                    bem.modifierConditional('singleColumn', singleColumn)
                )}>
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
                    <div className={`radioPanelGroup--responsive radioPanelGroup--${style}`}>
                        {radios.map(({ onChange, value, key, ...otherRadioProps }: RadioPanelBaseProps) => (
                            <div className={`radioPanelWrapper radioPanelWrapper--${style}`} key={`${key}${value}`}>
                                {style === 'panel' && (
                                    <RadioPanel
                                        onChange={onChange}
                                        value={value}
                                        {...otherRadioProps}
                                        inputProps={{ autoComplete: 'off' }}
                                    />
                                )}
                                {style === 'radio' && (
                                    <Radio onChange={onChange} value={value} {...otherRadioProps} autoComplete="off" />
                                )}
                            </div>
                        ))}
                    </div>
                    {!!expandedContentRenderer && (
                        <div className="radioPanelGroup__expandedContent">{expandedContentRenderer()}</div>
                    )}
                </fieldset>
            </div>
        </SkjemaGruppe>
    );
};

export default injectIntl(RadioPanelGroupBase);
