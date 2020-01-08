import React from 'react';
import './itemList.less';
import bemUtils from 'common/utils/bemUtils';
import DeleteButton from 'common/components/delete-button/DeleteButton';
import ActionLink from 'common/components/action-link/ActionLink';

export interface ListItem {
    id: string;
    label: string;
}

type EditItemAction = (id: string) => void;

interface Props {
    items: ListItem[];
    labelRenderer?: (id: string, onEdit?: EditItemAction) => React.ReactNode;
    iconRender?: (id: string) => React.ReactNode;
    onDelete?: (id: string) => void;
    onEdit?: EditItemAction;
}

const bem = bemUtils('itemList');
const bemItem = bem.child('item');

const ItemList: React.FunctionComponent<Props> = ({ items, onDelete, onEdit, labelRenderer, iconRender }) => (
    <ol className={bem.classNames(bem.block)}>
        {items.map((item) => (
            <li key={item.id} className={bemItem.block}>
                {iconRender && (
                    <span className={bemItem.element('icon')} role="presentation">
                        {iconRender(item.id)}
                    </span>
                )}
                <span className={bemItem.element('label')}>
                    {labelRenderer ? (
                        labelRenderer(item.id)
                    ) : onEdit ? (
                        <ActionLink onClick={() => onEdit(item.id)}>{item.label}</ActionLink>
                    ) : (
                        item.label
                    )}
                </span>
                {onDelete && (
                    <span className={bemItem.element('delete')}>
                        <DeleteButton ariaLabel={`Fjern ${item.label}`} onClick={() => onDelete(item.id)} />
                    </span>
                )}
            </li>
        ))}
    </ol>
);

export default ItemList;
