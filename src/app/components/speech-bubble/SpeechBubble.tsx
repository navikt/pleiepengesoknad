import * as React from 'react';
import bemHelper from '../../utils/bemHelper';
import { Normaltekst as NormalText } from 'nav-frontend-typografi';
import './speechBubble.less';

const bem = bemHelper('speechBubble');

interface SpeechBubbleProps {
    strongText: string;
    normalText: string;
}

const SpeechBubble: React.FunctionComponent<SpeechBubbleProps> = ({ strongText, normalText }) => (
    <div className={bem.className}>
        <NormalText>
            <strong>{strongText}</strong>
        </NormalText>
        <NormalText>{normalText}</NormalText>
        <div className={bem.element('triangle')} />
    </div>
);

export default SpeechBubble;
