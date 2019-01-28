import * as React from 'react';
import CustomSVG from '../custom-svg/CustomSVG';
import bemHelper from '../../utils/bemHelper';
const trashcanIcon = require('./trashcan.svg').default;
import './deleteButton.less';

interface DeleteButtonProps {
    ariaLabel: string;
    onClick: (e: React.SyntheticEvent) => void;
}

const bem = bemHelper('deleteButton');

const DeleteButton: React.FunctionComponent<DeleteButtonProps> = ({ ariaLabel, onClick }) => (
    <button
        type="button"
        className={bem.className}
        aria-label={ariaLabel}
        onClick={(e) => {
            e.stopPropagation();
            onClick(e);
        }}>
        <CustomSVG iconRef={trashcanIcon} size={22} />
    </button>
);

export default DeleteButton;
