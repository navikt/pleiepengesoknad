import * as React from 'react';
import bemHelper from 'common/utils/bemUtils';
import './box.less';

type BoxMargin = 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';

interface BoxProps {
    margin?: BoxMargin;
    padBottom?: BoxMargin;
    textAlignCenter?: boolean;
    className?: string;
}

const bem = bemHelper('box');

const Box: React.FunctionComponent<BoxProps> = ({ margin, padBottom, className, textAlignCenter, children }) => {
    const classNames = bem.classNames(
        bem.block,
        bem.modifierConditional(margin, margin !== undefined),
        bem.modifierConditional(`bottom-${padBottom}`, padBottom !== undefined),
        {
            [bem.modifier('textAlignCenter')]: textAlignCenter,
            [`${className}`]: className !== undefined
        }
    );
    return <div className={classNames}>{children}</div>;
};

export default Box;
