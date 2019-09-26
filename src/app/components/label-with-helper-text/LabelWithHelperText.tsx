import * as React from 'react';
import bemUtils from '../../utils/bemUtils';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';
import intlHelper from 'app/utils/intlUtils';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import './labelWithHelperText.less';

interface LabelWithHelperText {
    children: React.ReactNode;
    helperText: string;
    htmlFor?: string;
    showByDefault?: boolean;
}

const bem = bemUtils('labelWithHelperText');
const LabelWithHelperText: React.FunctionComponent<LabelWithHelperText & WrappedComponentProps> = ({
    children,
    helperText,
    htmlFor,
    showByDefault,
    intl
}) => {
    const [showHelperText, setShowHelperText] = React.useState(showByDefault === true);
    const ariaLabel = intlHelper(intl, showHelperText ? 'hjelpetekst.skjul' : 'hjelpetekst.vis');
    return (
        <label className={`${bem.block} skjemaelement__label`} htmlFor={htmlFor}>
            {children}
            <HelperTextButton
                onClick={() => setShowHelperText(!showHelperText)}
                ariaLabel={ariaLabel}
                ariaPressed={showHelperText}
            />
            {showHelperText && <HelperTextPanel>{helperText}</HelperTextPanel>}
        </label>
    );
};

export default injectIntl(LabelWithHelperText);
