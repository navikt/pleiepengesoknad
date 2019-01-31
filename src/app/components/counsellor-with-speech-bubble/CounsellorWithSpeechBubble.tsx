import * as React from 'react';
import bemHelper from '../../utils/bemHelper';
import SpeechBubble from '../speech-bubble/SpeechBubble';
import Counsellor from '../counsellor/Counsellor';
import './counsellorWithSpeechBubble.less';

const bem = bemHelper('counsellorWithSpeechBubble');
const CounsellorWithSpeechBubble: React.FunctionComponent = () => (
    <div className={bem.className}>
        <SpeechBubble strongText="Hei!" normalText="Velkommen til søknad om pleiepenger for pleie av sykt barn." />
        <Counsellor />
    </div>
);

export default CounsellorWithSpeechBubble;
