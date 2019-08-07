import * as React from 'react';
import bemHelper from '../../utils/bemUtils';
import classnames from 'classnames';
import './box.less';

type BoxMargin = 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';

interface BoxProps {
    margin: BoxMargin;
    textAlignCenter?: boolean;
    className?: string;
}

const bem = bemHelper('box');

const Box: React.FunctionComponent<BoxProps> = ({ margin, className, textAlignCenter, children }) => {
    const classNames = classnames(bem.block, bem.modifier(margin), {
        [bem.modifier('textAlignCenter')]: textAlignCenter,
        [`${className}`]: className !== undefined
    });
    return <div className={classNames}>{children}</div>;
};

export default Box;
