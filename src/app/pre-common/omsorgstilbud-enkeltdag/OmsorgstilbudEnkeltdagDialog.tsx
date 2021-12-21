import React from 'react';
import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import dateFormatter from '../../utils/common/dateFormatterUtils';
import OmsorgstilbudEnkeltdagForm, { OmsorgstilbudEnkeltdagEndring } from './OmsorgstilbudEnkeltdagForm';
import './omsorgstilbudEnkeltdagEdit.less';

interface Props {
    isOpen?: boolean;
    dato: Date;
    tid?: Partial<InputTime>;
    periode: DateRange;
    onSubmit: (evt: OmsorgstilbudEnkeltdagEndring) => void;
    onCancel: () => void;
}

const OmsorgstilbudEnkeltdagDialog: React.FunctionComponent<Props> = ({
    isOpen,
    dato,
    tid,
    periode,
    onSubmit,
    onCancel,
}) => {
    return isOpen ? (
        <>
            <Modal
                isOpen={isOpen}
                contentLabel={`Omsorgstilbud ${dateFormatter.full(dato)}`}
                onRequestClose={onCancel}
                shouldCloseOnOverlayClick={false}
                className="omsorgstilbudEnkeltdagDialog">
                <OmsorgstilbudEnkeltdagForm
                    periode={periode}
                    tid={tid}
                    dato={dato}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                />
            </Modal>
        </>
    ) : null;
};

export default OmsorgstilbudEnkeltdagDialog;
