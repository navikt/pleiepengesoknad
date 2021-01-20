import * as React from 'react';
import Modal, { ModalProps } from '@navikt/sif-common-core/lib/components/modal/Modal';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import DinePlikterContent from '../dine-plikter-content/DinePlikterContent';
import './dinePlikterModal.less';

const bem = bemUtils('dinePlikterModal');

type Props = Omit<ModalProps, 'children'>;

const DinePlikterModal = (props: Props) => (
    <Modal className={bem.block} {...props}>
        <DinePlikterContent />
    </Modal>
);

export default DinePlikterModal;
