import * as React from 'react';
import Banner from '../banner/Banner';
import bemHelper from '../../utils/bemHelper';
import CounsellorWithSpeechBubble, {
    CounsellorWithSpeechBubbleProps
} from '../counsellor-with-speech-bubble/CounsellorWithSpeechBubble';
import './frontPageBanner.less';

const bem = bemHelper('frontPageBanner');

interface FrontPageBannerProps {
    counsellorWithSpeechBubbleProps: CounsellorWithSpeechBubbleProps;
}

const FrontPageBanner: React.FunctionComponent<FrontPageBannerProps> = ({ counsellorWithSpeechBubbleProps }) => (
    <Banner size="large" className={bem.className}>
        <CounsellorWithSpeechBubble {...counsellorWithSpeechBubbleProps} />
    </Banner>
);

export default FrontPageBanner;
