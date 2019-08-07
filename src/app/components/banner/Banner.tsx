import * as React from 'react';
import bemHelper from '../../utils/bemUtils';
import './banner.less';

export type BannerSize = 'small' | 'large' | 'xlarge';

interface BannerProps {
    size: BannerSize;
    className?: string;
}

const bem = bemHelper('banner');
const Banner: React.FunctionComponent<BannerProps> = ({ size, className, children }) => (
    <div className={`${bem.block} ${bem.block}--${size} ${className}`}>{children}</div>
);

export default Banner;
