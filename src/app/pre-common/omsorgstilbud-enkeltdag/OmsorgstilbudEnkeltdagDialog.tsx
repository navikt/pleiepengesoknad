import React from 'react';
import { InputTime } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import dateFormatter from '../../utils/common/dateFormatterUtils';
import { Tid } from '../../types';
import OmsorgstilbudEnkeltdagForm from './OmsorgstilbudEnkeltdagForm';
import './omsorgstilbudEnkeltdagEdit.less';

interface Props {
    isOpen?: boolean;
    dato: Date;
    tid?: Partial<InputTime>;
    onSubmit: (tid: Tid) => void;
    onCancel: () => void;
}

const OmsorgstilbudEnkeltdagDialog: React.FunctionComponent<Props> = ({ isOpen, dato, tid, onSubmit, onCancel }) => {
    return isOpen ? (
        <>
            <Modal
                isOpen={isOpen}
                contentLabel={`Omsorgstilbud ${dateFormatter.full(dato)}`}
                onRequestClose={onCancel}
                shouldCloseOnOverlayClick={false}
                className="omsorgstilbudEnkeltdagDialog">
                <OmsorgstilbudEnkeltdagForm tid={tid} dato={dato} onCancel={onCancel} onSubmit={onSubmit} />
            </Modal>
        </>
    ) : null;
};

export default OmsorgstilbudEnkeltdagDialog;
