import * as React from 'react';
import { connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import AttachmentList from '../attachment-list/AttachmentList';
import { removeElementFromArray } from '../../utils/listUtils';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';
import { deleteFile } from '../../api/api';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from '../../utils/attachmentUtils';
import Box from '../box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from '../attachment-list-with-deletion/AttachmentListWithDeletion';
import { FormattedMessage } from 'react-intl';

interface LegeerklæringAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = LegeerklæringAttachmentListProps & ConnectedFormikProps<Field>;

const LegeerklæringAttachmentList: React.FunctionComponent<Props> = ({
    formik: { values, setFieldValue },
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality
}) => {
    const legeerklæring: Attachment[] = values[Field.legeerklæring].filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(legeerklæring)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenLegeerklæringLastetOpp" />
            </Normaltekst>
        );
        if (wrapNoAttachmentsInBox) {
            return <Box margin="m">{noAttachmentsText}</Box>;
        }
        return noAttachmentsText;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
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
            />
        );
    } else {
        return <AttachmentList attachments={legeerklæring} />;
    }
};

export default connect<LegeerklæringAttachmentListProps, Field>(LegeerklæringAttachmentList);
