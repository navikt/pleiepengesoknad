import * as React from 'react';
import InformationIcon from '../information-icon/InformationIcon';
import bemUtils from '../../utils/bemUtils';
import './informationIconButton.less';

const bem = bemUtils('informationIconButton');

interface InformationIconButtonProps {
    onClick: () => void;
}

const InformationIconButton: React.FunctionComponent<InformationIconButtonProps> = ({ onClick }) => (
    <button type="button" className={bem.className} onClick={onClick}>
        <InformationIcon />
    </button>
);

export default InformationIconButton;
