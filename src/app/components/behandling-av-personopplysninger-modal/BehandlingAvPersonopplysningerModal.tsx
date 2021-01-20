import * as React from 'react';
import Modal, { ModalProps } from '@navikt/sif-common-core/lib/components/modal/Modal';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
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
