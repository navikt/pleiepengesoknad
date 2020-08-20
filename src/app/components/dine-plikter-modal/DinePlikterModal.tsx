import * as React from 'react';
import Modal, { ModalProps } from '@sif-common/core/components/modal/Modal';
import bemUtils from '@sif-common/core/utils/bemUtils';
import DinePlikterContent from '../dine-plikter-content/DinePlikterContent';
import './dinePlikterModal.less';

const bem = bemUtils('dinePlikterModal');
const DinePlikterModal = (props: ModalProps) => (
    <Modal className={bem.block} {...props}>
        <DinePlikterContent />
    </Modal>
);

export default DinePlikterModal;
