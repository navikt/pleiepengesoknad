import * as React from 'react';
import InformationIcon from '../information-icon/InformationIcon';
import bemUtils from '../../utils/bemUtils';
import './informationIconButton.less';

const bem = bemUtils('informationIconButton');

interface InformationIconButtonProps {
    onClick: () => void;
    ariaLabel: string;
    ariaPressed: boolean;
}

const InformationIconButton: React.FunctionComponent<InformationIconButtonProps> = ({
    onClick,
    ariaLabel,
    ariaPressed
}) => (
    <button
        type="button"
        className={bem.className}
        onClick={onClick}
        aria-label={ariaLabel}
        title={ariaLabel}
        aria-pressed={ariaPressed}>
        <InformationIcon />
    </button>
);

export default InformationIconButton;
