import * as React from 'react';
import { default as NFModal } from 'nav-frontend-modal';

interface ModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

const Modal: React.FunctionComponent<ModalProps> = ({ isOpen, onRequestClose, children }) => (
    <NFModal isOpen={isOpen} contentLabel="Some contentLabel" onRequestClose={onRequestClose}>
        {children}
    </NFModal>
);

export default Modal;
