import * as React from 'react';
import { CheckboksPanel, CheckboksPanelProps, SkjemaGruppe } from 'nav-frontend-skjema';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import HelperTextPanel from '../../components/helper-text-panel/HelperTextPanel';
import HelperTextButton from '../../components/helper-text-button/HelperTextButton';
import 'nav-frontend-skjema-style';
import './checkboxPanelGroupBase.less';
import intlHelper from 'common/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';

export type CheckboxPanelExpandedContentRenderer = () => React.ReactNode;

type CheckboxPanelBaseProps = CheckboksPanelProps & {
    key?: string;
    expandedContentRenderer?: CheckboxPanelExpandedContentRenderer;
};

interface CheckboxPanelGroupBaseProps {
    legend: string;
    checkboxes: CheckboxPanelBaseProps[];
    feil?: SkjemaelementFeil;
    helperText?: string;
    singleColumn?: boolean;
}

const CheckboxPanelGroupBase = ({
    legend,
    checkboxes,
    feil,
    helperText,
    singleColumn: columns,
    intl
}: CheckboxPanelGroupBaseProps & InjectedIntlProps) => {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const ariaLabel = intlHelper(intl, showHelperText ? 'hjelpetekst.skjul' : 'hjelpetekst.vis');
    return (
        <SkjemaGruppe feil={feil}>
            <div
                className={`checkboxPanelGroup skjemaelement${
                    columns ? ` checkboxPanelGroup--singleColumn` : undefined
                }`}>
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
                        {checkboxes.map(
                            ({
                                onChange,
                                value,
                                key,
                                expandedContentRenderer,
                                ...otherCheckboxProps
                            }: CheckboxPanelBaseProps) => (
                                <div className="checkboxPanelWrapper" key={key}>
                                    <CheckboksPanel onChange={onChange} value={value} {...otherCheckboxProps} />
                                    {!!expandedContentRenderer && otherCheckboxProps.checked && (
                                        <div className="checkboxPanelGroup__expandedContent">
                                            {expandedContentRenderer()}
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </fieldset>
            </div>
        </SkjemaGruppe>
    );
};

export default injectIntl(CheckboxPanelGroupBase);
