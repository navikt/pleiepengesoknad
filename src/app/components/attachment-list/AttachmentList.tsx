import * as React from 'react';
import PlainList from '../plain-list/PlainList';
import AttachmentListElement from '../attachment-list-element/AttachmentListElement';

interface AttachmentListProps {
    attachments: Attachment[];
    onRemoveAttachmentClick: (attachment: Attachment, e: React.SyntheticEvent) => void;
    deleteButtonAriaLabel: string;
}

const AttachmentList: React.FunctionComponent<AttachmentListProps> = ({ attachments, ...otherProps }) => (
    <PlainList>
        {attachments.map((attachment) => (
            <AttachmentListElement attachment={attachment} {...otherProps} />
        ))}
    </PlainList>
);

export default AttachmentList;
