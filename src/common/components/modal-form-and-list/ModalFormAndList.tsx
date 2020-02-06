import React from 'react';
import FieldsetBase from '../../form-components/fieldset-base/FieldsetBase';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { guid } from 'nav-frontend-js-utils';
import Modal from 'common/components/modal/Modal';
import Box from 'common/components/box/Box';
import { Knapp } from 'nav-frontend-knapper';

type ModalFormRenderer<T> = (onSubmit: (item: T) => void, onCancel: () => void, item?: T) => React.ReactNode;
type ListRenderer = (onEdit: (item: ListItemBase) => void, onDelete: (item: ListItemBase) => void) => React.ReactNode;

export interface ListItemBase {
    id?: string;
}

export interface ModalFormAndListLabels {
    modalTitle: string;
    listTitle: string;
    addLabel: string;
    info?: string;
}

interface Props<T extends ListItemBase> {
    labels: ModalFormAndListLabels;
    items: T[];
    listRenderer: ListRenderer;
    formRenderer: ModalFormRenderer<T>;
    onChange: (data: T[]) => void;
    error?: SkjemaelementFeil;
}

function ModalFormAndList<T extends ListItemBase>({
    items = [],
    listRenderer,
    formRenderer,
    labels,
    error,
    onChange
}: Props<T>) {
    const [modalState, setModalState] = React.useState<{ isVisible: boolean; selectedItem?: T }>({
        isVisible: false
    });

    const handleOnSubmit = (values: T) => {
        if (values.id) {
            onChange([...items.filter((item) => item.id !== values.id), values]);
        } else {
            onChange([...items, { id: guid(), ...values }]);
        }
        setModalState({ isVisible: false });
    };

    const handleEdit = (item: T) => {
        setModalState({ isVisible: true, selectedItem: item });
    };

    const handleDelete = (item: T) => {
        onChange([...items.filter((i) => i.id !== item.id)]);
    };

    const resetModal = () => {
        setModalState({ isVisible: false, selectedItem: undefined });
    };

    return (
        <>
            <Modal isOpen={modalState.isVisible} contentLabel={labels.modalTitle} onRequestClose={resetModal}>
                {formRenderer(handleOnSubmit, resetModal, modalState.selectedItem)}
            </Modal>
            <FieldsetBase legend={labels.listTitle} helperText={labels.info} feil={error}>
                {listRenderer(handleEdit, handleDelete)}
                <Box margin="m">
                    <Knapp htmlType="button" onClick={() => setModalState({ isVisible: true })}>
                        {labels.addLabel}
                    </Knapp>
                </Box>
            </FieldsetBase>
        </>
    );
}

export default ModalFormAndList;
