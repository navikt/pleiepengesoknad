import * as React from 'react';
import { connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import AttachmentList from '../attachment-list/AttachmentList';
import { removeElementFromArray } from '../../utils/listUtils';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { deleteFile } from '../../api/api';
import { containsAnyUploadedAttachments } from '../../utils/attachmentUtils';
import Box from '../box/Box';
import { Normaltekst } from 'nav-frontend-typografi';

interface LegeerklæringAttachmentListProps {
    wrapNoAttachmentsInBox?: boolean;
}

type Props = LegeerklæringAttachmentListProps & ConnectedFormikProps<Field>;

const LegeerklæringAttachmentList: React.FunctionComponent<Props> = ({
    formik: { values, setFieldValue },
    wrapNoAttachmentsInBox
}) => {
    const legeerklæring: Attachment[] = values[Field.legeerklæring];

    if (!containsAnyUploadedAttachments(legeerklæring)) {
        const noAttachmentsText = <Normaltekst>Ingen vedlegg er lastet opp</Normaltekst>;
        if (wrapNoAttachmentsInBox) {
            return <Box margin="m">{noAttachmentsText}</Box>;
        }
        return noAttachmentsText;
    }

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

export default connect<LegeerklæringAttachmentListProps, Field>(LegeerklæringAttachmentList);
