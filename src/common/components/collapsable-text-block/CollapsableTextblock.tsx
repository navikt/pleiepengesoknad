import React, { useState } from 'react';
import CollapseToggler from './CollapseToggler';
import './collapsableTextBlock.less';
import { Element } from 'nav-frontend-typografi';
import CollapseContainer from '../collapsable-container/CollapsableContainer';
import { guid } from 'nav-frontend-js-utils';
import bemUtils from "../../utils/bemUtils";

interface Props {
    children: React.ReactNode;
    initialOpen?: boolean;
    title?: string;
}

const bem = bemUtils('collapsableTextBlock');

const CollapsableTextBlock: React.FunctionComponent<Props> = ({ children, initialOpen, title }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [contentId] = useState(guid());

    const titleBlock = (
        <Element tag="h3" className={bem.element('title')}>
            {title}
        </Element>
    );

    return (
        <div className={bem.classNames(bem.block, bem.modifierConditional('open', isOpen))}>
            <div className={bem.element('toggler')}>
                <CollapseToggler onToggle={() => setIsOpen(!isOpen)} isOpen={isOpen} contentId={contentId}>
                    {titleBlock}
                </CollapseToggler>
            </div>
            <CollapseContainer isOpen={isOpen}>
                <div className={bem.element('content')} id={contentId}>
                    {children}
                </div>
            </CollapseContainer>
        </div>
    );
};

export default CollapsableTextBlock;
