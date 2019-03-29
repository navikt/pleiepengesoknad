import * as React from 'react';
import bemUtils from '../../utils/bemUtils';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';
import './labelWithHelperText.less';

interface LabelWithHelperText {
    children: React.ReactNode;
    helperText: string;
    htmlFor?: string;
    showByDefault?: boolean;
}

const bem = bemUtils('labelWithHelperText');
const LabelWithHelperText: React.FunctionComponent<LabelWithHelperText> = ({
    children,
    helperText,
    htmlFor,
    showByDefault
}) => {
    const [showHelperText, setShowHelperText] = React.useState(showByDefault === true);
    const ariaLabel = showHelperText ? 'Lukk hjelpetekst' : 'Åpne hjelpetekst';
    return (
        <label className={`${bem.className} skjemaelement__label`} htmlFor={htmlFor}>
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

export default LabelWithHelperText;
