import * as React from 'react';
import UnstyledList from '../unstyled-list/UnstyledList';
import AttachmentListElement from '../attachment-list-element/AttachmentListElement';
import DeleteButton from '../delete-button/DeleteButton';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import ContentSwitcher from '../content-switcher/ContentSwitcher';

interface AttachmentListWithDeletionProps {
    attachments: Attachment[];
    onRemoveAttachmentClick: (attachment: Attachment, e: React.SyntheticEvent) => void;
}

const AttachmentListWithDeletion: React.FunctionComponent<AttachmentListWithDeletionProps> = ({
    attachments,
    onRemoveAttachmentClick
}) => (
    <UnstyledList>
        {attachments.filter(({ pending, uploaded }) => uploaded || pending).map((attachment, index) => (
            <AttachmentListElement
                attachment={attachment}
                key={attachment.file.name + index}
                renderRightAlignedContent={() => (
                    <ContentSwitcher
                        showFirstContent={attachment.pending}
                        firstContent={() => <LoadingSpinner type="XS" />}
                        secondContent={() => (
                            <DeleteButton
                                ariaLabel="Slett vedlegg"
                                onClick={(e) => onRemoveAttachmentClick(attachment, e)}>
                                Fjern vedlegg
                            </DeleteButton>
                        )}
                    />
                )}
            />
        ))}
    </UnstyledList>
);

export default AttachmentListWithDeletion;
