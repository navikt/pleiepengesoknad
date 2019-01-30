import * as React from 'react';
import { connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import AttachmentList from '../attachment-list/AttachmentList';
import { removeElementFromArray } from '../../utils/listHelper';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';

type LegeerklæringAttachmentListProps = ConnectedFormikProps<Field>;
const LegeerklæringAttachmentList: React.FunctionComponent<LegeerklæringAttachmentListProps> = ({
    formik: { values, setFieldValue }
}) => {
    const legeerklæring: Attachment[] = values[Field.legeerklæring];
    return (
        <AttachmentList
            attachments={legeerklæring}
            onRemoveAttachmentClick={(attachment: Attachment) =>
                setFieldValue(Field.legeerklæring, removeElementFromArray(attachment, legeerklæring))
            }
            deleteButtonAriaLabel="Fjern vedlegg"
        />
    );
};

export default connect<{}, Field>(LegeerklæringAttachmentList);
