import * as React from 'react';
import Banner from '../banner/Banner';
import CounsellorWithSpeechBubble from '../counsellor-with-speech-bubble/CounsellorWithSpeechBubble';
import bemHelper from '../../utils/bemHelper';
import './frontPageBanner.less';

const bem = bemHelper('frontPageBanner');
const FrontPageBanner: React.FunctionComponent = () => (
    <Banner size="large" className={bem.className}>
        <CounsellorWithSpeechBubble />
    </Banner>
);

export default FrontPageBanner;
