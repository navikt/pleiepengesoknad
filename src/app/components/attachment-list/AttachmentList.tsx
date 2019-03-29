import * as React from 'react';
import UnstyledList from '../unstyled-list/UnstyledList';
import AttachmentListElement from '../attachment-list-element/AttachmentListElement';

interface AttachmentListProps {
    attachments: Attachment[];
}

const AttachmentList: React.FunctionComponent<AttachmentListProps> = ({ attachments, ...otherProps }) => (
    <UnstyledList>
        {attachments.filter(({ pending, uploaded }) => uploaded || pending).map((attachment, index) => (
            <AttachmentListElement attachment={attachment} key={attachment.file.name + index} {...otherProps} />
        ))}
    </UnstyledList>
);

export default AttachmentList;
