import * as React from 'react';
import bemUtils from '../../utils/bemUtils';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import './labelWithHelperText.less';

interface LabelWithHelperText {
    children: React.ReactNode;
    helperText: string;
    htmlFor?: string;
    tag?: 'label' | 'div';
    showByDefault?: boolean;
}

const bem = bemUtils('labelWithHelperText');

const LabelWithHelperText: React.FunctionComponent<LabelWithHelperText & InjectedIntlProps> = ({
    children,
    helperText,
    htmlFor,
    showByDefault,
    tag = 'label',
    intl
}) => {
    const [showHelperText, setShowHelperText] = React.useState(showByDefault === true);
    const ariaLabel = intlHelper(intl, showHelperText ? 'hjelpetekst.skjul' : 'hjelpetekst.vis');
    const content = (
        <>
            {children}
            <HelperTextButton
                onClick={() => setShowHelperText(!showHelperText)}
                ariaLabel={ariaLabel}
                ariaPressed={showHelperText}
            />
            {showHelperText && <HelperTextPanel>{helperText}</HelperTextPanel>}
        </>
    );
    if (tag === 'div') {
        return <div>{content}</div>;
    }
    return (
        <label className={`${bem.block} skjemaelement__label`} htmlFor={htmlFor}>
            {content}
        </label>
    );
};

export default injectIntl(LabelWithHelperText);
