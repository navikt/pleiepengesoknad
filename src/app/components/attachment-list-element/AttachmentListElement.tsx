import * as React from 'react';
import DeleteButton from '../delete-button/DeleteButton';
import bemHelper from '../../utils/bemHelper';
import AttachmentLabel from '../attachment-label/AttachmentLabel';
const listElementBem = bemHelper(`attachmentListElement`);
import './attachmentListElement.less';
import ContentSwitcher from '../content-switcher/ContentSwitcher';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

interface AttachmentListElementProps {
    attachment: Attachment;
    onRemoveAttachmentClick: (attachment: Attachment, e: React.SyntheticEvent) => void;
    deleteButtonAriaLabel: string;
}

const AttachmentListElement: React.FunctionComponent<AttachmentListElementProps> = ({
    attachment,
    deleteButtonAriaLabel,
    onRemoveAttachmentClick
}) => (
    <li className={listElementBem.className}>
        <AttachmentLabel attachment={attachment} />
        <ContentSwitcher
            className={listElementBem.element('rightAlignedContent')}
            showInitialContent={attachment.pending}
            initialContent={() => <LoadingSpinner type="S" />}
            otherContent={() => (
                <DeleteButton ariaLabel={deleteButtonAriaLabel} onClick={(e) => onRemoveAttachmentClick(attachment, e)}>
                    Fjern vedlegg
                </DeleteButton>
            )}
        />
    </li>
);

export default AttachmentListElement;
