import * as React from 'react';
import bemHelper from '../../utils/bemUtils';
import './banner.less';

interface BannerProps {
    size: 'small' | 'large';
    className?: string;
}

const bem = bemHelper('banner');
const Banner: React.FunctionComponent<BannerProps> = ({ size, className, children }) => (
    <div className={`${bem.className} ${bem.className}--${size} ${className}`}>{children}</div>
);

export default Banner;
