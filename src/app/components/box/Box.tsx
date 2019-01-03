import * as React from 'react';
import bemHelper from '../../utils/bemHelper';
import './box.less';

type BoxMargin = 's' | 'm' | 'l' | 'xl';

interface BoxProps {
    margin: BoxMargin;
}

const bem = bemHelper('box');

const Box: React.FunctionComponent<BoxProps> = ({ margin, children }) => (
    <div className={`${bem.className} ${bem.modifier(margin)}`}>{children}</div>
);

export default Box;
