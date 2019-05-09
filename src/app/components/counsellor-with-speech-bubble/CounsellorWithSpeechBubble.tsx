import * as React from 'react';
import bemHelper from '../../utils/bemUtils';
import SpeechBubble from '../speech-bubble/SpeechBubble';
import Counsellor from '../counsellor/Counsellor';
import './counsellorWithSpeechBubble.less';

const bem = bemHelper('counsellorWithSpeechBubble');

export interface CounsellorWithSpeechBubbleProps {
    strongText: string;
    normalText: string;
    bottomContent?: React.ReactNode;
}

const CounsellorWithSpeechBubble: React.FunctionComponent<CounsellorWithSpeechBubbleProps> = ({
    strongText,
    normalText,
    bottomContent
}) => (
    <div className={bem.className}>
        <SpeechBubble strongText={strongText} normalText={normalText} bottomContent={bottomContent} />
        <Counsellor theme="dark" />
    </div>
);

export default CounsellorWithSpeechBubble;
