import * as React from 'react';
import Modal, { ModalProps } from '../modal/Modal';
import DinePlikterContent from '../dine-plikter-content/DinePlikterContent';
import bemUtils from '../../utils/bemUtils';
import './dinePlikterModal.less';

const bem = bemUtils('dinePlikterModal');
const DinePlikterModal: React.FunctionComponent<ModalProps> = (props) => (
    <Modal className={bem.block} {...props}>
        <DinePlikterContent />
    </Modal>
);

export default DinePlikterModal;
