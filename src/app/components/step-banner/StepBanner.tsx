import * as React from 'react';
import Banner from '../banner/Banner';
import { Undertittel } from 'nav-frontend-typografi';
import bemHelper from '../../utils/bemHelper';
import './stepBanner.less';

interface StepBannerProps {
    text: string;
}

const bem = bemHelper('stepBanner');
const StepBanner: React.FunctionComponent<StepBannerProps> = ({ text }) => (
    <Banner size="small" className={bem.className}>
        <Undertittel>{text}</Undertittel>
    </Banner>
);

export default StepBanner;
