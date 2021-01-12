import * as React from 'react';
import Modal, { ModalProps } from '@sif-common/core/components/modal/Modal';
import bemUtils from '@sif-common/core/utils/bemUtils';
import BehandlingAvPersonopplysningerContent from '../behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import './behandlingAvPersonopplysningerModal.less';

type Props = Omit<ModalProps, 'children'>;

const bem = bemUtils('behandlingAvPersonopplysningerModal');

const BehandlingAvPersonopplysningerModal = (props: Props) => (
    <Modal className={bem.block} {...props}>
        <BehandlingAvPersonopplysningerContent />
    </Modal>
);

export default BehandlingAvPersonopplysningerModal;
