import * as React from 'react';
import bemHelper from '../../utils/bemUtils';
import './box.less';

type BoxMargin = 's' | 'm' | 'l' | 'xl' | 'xxl';

interface BoxProps {
    margin: BoxMargin;
    className?: string;
}

const bem = bemHelper('box');

const Box: React.FunctionComponent<BoxProps> = ({ margin, className, children }) => (
    <div className={`${bem.className} ${bem.modifier(margin)} ${className ? className : ''}`}>{children}</div>
);

export default Box;
