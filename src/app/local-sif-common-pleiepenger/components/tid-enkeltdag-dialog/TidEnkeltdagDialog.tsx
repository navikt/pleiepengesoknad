import React from 'react';
import TidEnkeltdagForm, { TidEnkeltdagFormProps } from './TidEnkeltdagForm';
import './styles/tidEnkeltdagDialog.less';
import { Modal } from '@navikt/ds-react';

export interface TidEnkeltdagDialogProps {
    isOpen?: boolean;
    dialogTitle: string;
    formProps: TidEnkeltdagFormProps;
}

const TidEnkeltdagDialog: React.FunctionComponent<TidEnkeltdagDialogProps> = ({ isOpen = false, formProps }) => {
    if (!isOpen) {
        return null;
    }
    return isOpen ? (
        <Modal
            open={isOpen}
            // TODO contentLabel={`${dialogTitle} ${dateFormatter.dayDateMonthYear(formProps.dato)}`}
            onClose={formProps.onCancel}
            shouldCloseOnOverlayClick={false}
            className="tidEnkeltdagDialog">
            <TidEnkeltdagForm {...formProps} />
        </Modal>
    ) : null;
};

export default TidEnkeltdagDialog;
