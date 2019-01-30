import * as React from 'react';
import DeleteButton from '../delete-button/DeleteButton';
import bemHelper from '../../utils/bemHelper';
import AttachmentLabel from '../attachment-label/AttachmentLabel';
const listElementBem = bemHelper(`attachmentListElement`);
import './attachmentListElement.less';
import FadingLoadingSpinner from '../fading-loading-spinner/FadingLoadingSpinner';

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
        <FadingLoadingSpinner
            className={listElementBem.element('rightAlignedContent')}
            type="S"
            showSpinner={attachment.pending}
            spinnerReplacement={() => (
                <DeleteButton ariaLabel={deleteButtonAriaLabel} onClick={(e) => onRemoveAttachmentClick(attachment, e)}>
                    Fjern vedlegg
                </DeleteButton>
            )}
        />
    </li>
);

export default AttachmentListElement;
