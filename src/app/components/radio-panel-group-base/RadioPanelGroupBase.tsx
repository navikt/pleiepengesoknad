import * as React from 'react';
import { RadioPanel, RadioPanelProps, SkjemaGruppe, Radio } from 'nav-frontend-skjema';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Box from '../box/Box';
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
    childFormRender?: () => React.ReactNode;
}

const bem = bemUtils('radioPanelGruppe');

const RadioPanelGroupBase = ({
    legend,
    radios,
    feil,
    helperText,
    childFormRender,
    style = 'panel',
    intl
}: RadioPanelGroupBaseProps & InjectedIntlProps) => {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const ariaLabel = intlHelper(intl, showHelperText ? 'hjelpetekst.skjul' : 'hjelpetekst.vis');
    return (
        <SkjemaGruppe feil={feil}>
            <div className={bem.classNames(bem.block, 'skjemaelement')}>
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
                                    <RadioPanel onChange={onChange} value={value} {...otherRadioProps} />
                                )}
                                {style === 'radio' && <Radio onChange={onChange} value={value} {...otherRadioProps} />}
                            </div>
                        ))}
                    </div>
                    {!!childFormRender && <Box margin="l">{childFormRender()}</Box>}
                </fieldset>
            </div>
        </SkjemaGruppe>
    );
};

export default injectIntl(RadioPanelGroupBase);
