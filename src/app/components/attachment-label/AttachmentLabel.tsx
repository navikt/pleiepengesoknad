import * as React from 'react';
import Lenke from 'nav-frontend-lenker';
import CustomSVG from '../custom-svg/CustomSVG';
import bemHelper from '../../utils/bemHelper';
const attachmentIcon = require('./../../../assets/attachment.svg').default;
import './attachmentLabel.less';

interface AttachmentLabelProps {
    attachment: Attachment;
}

const attachmentLabelBem = bemHelper('attachmentLabel');

const AttachmentLabel: React.FunctionComponent<AttachmentLabelProps> = ({ attachment: { url, file } }) => (
    <span>
        <CustomSVG iconRef={attachmentIcon} size={22} />
        {url ? (
            <Lenke className={attachmentLabelBem.element('text')} href={url} target="_blank">
                {file.name}
            </Lenke>
        ) : (
            <div className={attachmentLabelBem.element('text')}>{file.name}</div>
        )}
    </span>
);

export default AttachmentLabel;
