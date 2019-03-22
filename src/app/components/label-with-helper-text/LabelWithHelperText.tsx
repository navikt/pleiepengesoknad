import * as React from 'react';
import bemUtils from '../../utils/bemUtils';
import InformationIconButton from '../information-icon-button/InformationIconButton';
import InformationPanel from '../information-panel/InformationPanel';
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
            <InformationIconButton onClick={() => setShowHelperText(!showHelperText)} ariaLabel={ariaLabel} />
            {showHelperText && <InformationPanel>{helperText}</InformationPanel>}
        </label>
    );
};

export default LabelWithHelperText;
