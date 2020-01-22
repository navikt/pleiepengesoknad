import * as React from 'react';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import HelperTextPanel from '../../components/helper-text-panel/HelperTextPanel';
import HelperTextButton from '../../components/helper-text-button/HelperTextButton';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import bemUtils from 'common/utils/bemUtils';

import './fieldsetBase.less';

interface Props {
    legend: string;
    children: React.ReactNode;
    feil?: SkjemaelementFeil;
    helperText?: string;
    singleColumn?: boolean;
    description?: React.ReactNode;
}

const bem = bemUtils('skjema__fieldset');

const FieldsetBase = ({ legend, feil, helperText, description, children }: Props) => {
    const [showHelperText, setShowHelperText] = React.useState(false);
    const intl = useIntl();
    const ariaLabel = intlHelper(intl, showHelperText ? 'hjelpetekst.skjul' : 'hjelpetekst.vis');
    return (
        <SkjemaGruppe feil={feil}>
            <fieldset className={bem.block}>
                <legend className={bem.element('legend')}>
                    {legend}
                    {helperText && (
                        <span className={bem.element('helperTextButton')}>
                            <HelperTextButton
                                onClick={() => setShowHelperText(!showHelperText)}
                                ariaLabel={ariaLabel}
                                ariaPressed={showHelperText}
                            />
                        </span>
                    )}
                </legend>
                {showHelperText && (
                    <div className={bem.element('helperTextPanel')}>
                        <HelperTextPanel>{helperText}</HelperTextPanel>
                    </div>
                )}
                {description && <p className={bem.element('description')}>{description}</p>}
                <div className={bem.element('content')}>{children}</div>
            </fieldset>
        </SkjemaGruppe>
    );
};

export default FieldsetBase;
