import * as React from 'react';
import bemHelper from '../../utils/bemHelper';
import SpeechBubble from '../speech-bubble/SpeechBubble';
import Counsellor from '../counsellor/Counsellor';
import './counsellorWithSpeechBubble.less';

const bem = bemHelper('counsellorWithSpeechBubble');

export interface CounsellorWithSpeechBubbleProps {
    strongText: string;
    normalText: string;
}

const CounsellorWithSpeechBubble: React.FunctionComponent<CounsellorWithSpeechBubbleProps> = ({
    strongText,
    normalText
}) => (
    <div className={bem.className}>
        <SpeechBubble strongText={strongText} normalText={normalText} />
        <Counsellor />
    </div>
);

export default CounsellorWithSpeechBubble;
