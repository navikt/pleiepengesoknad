import * as React from 'react';
import bemHelper from '../../utils/bemUtils';
import AttachmentLabel from '../attachment-label/AttachmentLabel';
const listElementBem = bemHelper(`attachmentListElement`);
import './attachmentListElement.less';

interface AttachmentListElementProps {
    attachment: Attachment;
    renderRightAlignedContent?: () => React.ReactNode;
}

const AttachmentListElement: React.FunctionComponent<AttachmentListElementProps> = ({
    attachment,
    renderRightAlignedContent
}) => (
    <li className={listElementBem.block}>
        <AttachmentLabel attachment={attachment} />
        {renderRightAlignedContent && (
            <span className={listElementBem.element('rightAlignedContent')}>{renderRightAlignedContent()}</span>
        )}
    </li>
);

export default AttachmentListElement;
