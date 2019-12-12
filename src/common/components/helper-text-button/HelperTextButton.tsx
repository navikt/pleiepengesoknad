import * as React from 'react';
import HelperTextIcon from '../helper-text-icon/HelperTextIcon';
import bemUtils from '../../utils/bemUtils';
import './helperTextButton.less';

const bem = bemUtils('helperTextButton');

interface HelperTextButtonProps {
    onClick: () => void;
    ariaLabel: string;
    ariaPressed: boolean;
}

const HelperTextButton: React.FunctionComponent<HelperTextButtonProps> = ({ onClick, ariaLabel, ariaPressed }) => (
    <button
        type="button"
        className={bem.block}
        onClick={onClick}
        aria-label={ariaLabel}
        title={ariaLabel}
        aria-pressed={ariaPressed}>
        <HelperTextIcon />
    </button>
);

export default HelperTextButton;
