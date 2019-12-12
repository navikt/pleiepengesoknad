import * as React from 'react';
import { default as NFModal } from 'nav-frontend-modal';
import bemUtils from 'common/utils/bemUtils';
import './modal.less';

export interface ModalProps {
    className?: string;
    isOpen: boolean;
    onRequestClose: () => void;
    contentLabel: string;
}

const bem = bemUtils('modal');
const Modal: React.FunctionComponent<ModalProps> = ({ isOpen, onRequestClose, contentLabel, className, children }) => (
    <NFModal
        className={`${bem.block} ${className}`}
        isOpen={isOpen}
        contentLabel={contentLabel}
        onRequestClose={onRequestClose}>
        <article className={bem.element('content')}>{children}</article>
    </NFModal>
);

export default Modal;
