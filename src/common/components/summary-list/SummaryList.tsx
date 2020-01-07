import React from 'react';
import './summaryList.less';
import bemUtils from 'common/utils/bemUtils';

interface Props {
    items: any[];
    itemRenderer: (data: any) => React.ReactNode;
}

const bem = bemUtils('summaryList');

const SummaryList: React.FunctionComponent<Props> = ({ items, itemRenderer }) => (
    <ul className={bem.block}>
        {items.map((item, idx) => (
            <li key={idx} className={bem.element('item')}>
                {itemRenderer(item)}
            </li>
        ))}
    </ul>
);

export default SummaryList;
