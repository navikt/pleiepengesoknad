import * as React from 'react';
import Modal, { ModalProps } from 'common/components/modal/Modal';
import bemUtils from 'common/utils/bemUtils';
import BehandlingAvPersonopplysningerContent from '../behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import './behandlingAvPersonopplysningerModal.less';

const bem = bemUtils('behandlingAvPersonopplysningerModal');
const BehandlingAvPersonopplysningerModal: React.FunctionComponent<ModalProps> = (props) => (
    <Modal className={bem.block} {...props}>
        <BehandlingAvPersonopplysningerContent />
    </Modal>
);

export default BehandlingAvPersonopplysningerModal;
