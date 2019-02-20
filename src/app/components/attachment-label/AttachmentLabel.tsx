import * as React from 'react';
import Lenke from 'nav-frontend-lenker';
import CustomSVG from '../custom-svg/CustomSVG';
import bemHelper from '../../utils/bemUtils';
const attachmentIcon = require('./../../../assets/attachment.svg').default;
import './attachmentLabel.less';
import ContentSwitcher from '../content-switcher/ContentSwitcher';

interface AttachmentLabelProps {
    attachment: Attachment;
}

const attachmentLabelBem = bemHelper('attachmentLabel');

const AttachmentLabel: React.FunctionComponent<AttachmentLabelProps> = ({ attachment: { url, file } }) => (
    <span>
        <CustomSVG iconRef={attachmentIcon} size={20} />
        <ContentSwitcher
            firstContent={() => <div className={attachmentLabelBem.element('text')}>{file.name}</div>}
            secondContent={() => (
                <Lenke className={attachmentLabelBem.element('text')} href={url!} target="_blank">
                    {file.name}
                </Lenke>
            )}
            showFirstContent={url === undefined}
        />
    </span>
);

export default AttachmentLabel;
