import React from 'react';
import bemUtils from 'common/utils/bemUtils';
import DeleteButton from 'common/components/delete-button/DeleteButton';
import ActionLink from 'common/components/action-link/ActionLink';
import { guid } from 'nav-frontend-js-utils';
import './itemList.less';

interface Props<T> {
    items: T[];
    getItemId: (item: T) => string | undefined;
    getItemTitle: (item: T) => string;
    labelRenderer?: (item: T, onEdit?: (item: T) => void) => React.ReactNode;
    iconRender?: (item: T) => React.ReactNode;
    onDelete?: (item: T) => void;
    onEdit?: (item: T) => void;
}

const bem = bemUtils('itemList');
const bemItem = bem.child('item');

function ItemList<T>({ items, onDelete, onEdit, labelRenderer, iconRender, getItemId, getItemTitle }: Props<T>) {
    return (
        <ol className={bem.classNames(bem.block)}>
            {items.map((item) => {
                const itemTitle = getItemTitle(item);
                return (
                    <li key={getItemId(item) || guid()} className={bemItem.block}>
                        {iconRender && (
                            <span className={bemItem.element('icon')} role="presentation">
                                {iconRender(item)}
                            </span>
                        )}
                        <span className={bemItem.element('label')}>
                            {labelRenderer ? (
                                labelRenderer(item)
                            ) : onEdit ? (
                                <ActionLink onClick={() => onEdit(item)}>{itemTitle}</ActionLink>
                            ) : (
                                itemTitle
                            )}
                        </span>
                        {onDelete && (
                            <span className={bemItem.element('delete')}>
                                <DeleteButton ariaLabel={`Fjern ${itemTitle}`} onClick={() => onDelete(item)} />
                            </span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}
export default ItemList;
