import * as React from 'react';
import { connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import AttachmentList from '../attachment-list/AttachmentList';
import { removeElementFromArray } from '../../utils/listHelper';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { deleteFile } from '../../utils/apiHelper';

type LegeerklæringAttachmentListProps = ConnectedFormikProps<Field>;
const LegeerklæringAttachmentList: React.FunctionComponent<LegeerklæringAttachmentListProps> = ({
    formik: { values, setFieldValue }
}) => {
    const legeerklæring: Attachment[] = values[Field.legeerklæring];
    return (
        <AttachmentList
            attachments={legeerklæring}
            onRemoveAttachmentClick={(attachment: Attachment) => {
                attachment.pending = true;
                setFieldValue(Field.legeerklæring, legeerklæring);
                deleteFile(attachment.url!).then(
                    () => {
                        setFieldValue(Field.legeerklæring, removeElementFromArray(attachment, legeerklæring));
                    },
                    () => {
                        setFieldValue(Field.legeerklæring, removeElementFromArray(attachment, legeerklæring));
                    }
                );
            }}
            deleteButtonAriaLabel="Fjern vedlegg"
        />
    );
};

export default connect<{}, Field>(LegeerklæringAttachmentList);
