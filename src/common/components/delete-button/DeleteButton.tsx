import * as React from 'react';
import CustomSVG from '../custom-svg/CustomSVG';
import bemHelper from 'common/utils/bemUtils';
const trashcanIcon = require('./assets/trashcan.svg').default;
import './deleteButton.less';

interface DeleteButtonProps {
    ariaLabel: string;
    onClick: (e: React.SyntheticEvent) => void;
}

const bem = bemHelper('deleteButton');

const DeleteButton: React.FunctionComponent<DeleteButtonProps> = ({ ariaLabel, onClick }) => (
    <button
        type="button"
        className={bem.block}
        aria-label={ariaLabel}
        onClick={(e) => {
            e.stopPropagation();
            onClick(e);
        }}>
        <CustomSVG iconRef={trashcanIcon} size={20} />
    </button>
);

export default DeleteButton;
