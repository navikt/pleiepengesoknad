import React from 'react';
import { NæringFormData } from './types';
import ActionLink from 'common/components/action-link/ActionLink';
import ItemList from 'common/components/item-list/ItemList';
import bemUtils from 'common/utils/bemUtils';

import './næringListe.less';

interface Props {
    næringer: NæringFormData[];
    onEdit?: (næring: NæringFormData) => void;
    onDelete?: (næring: NæringFormData) => void;
}

const bem = bemUtils('næringListe');

const NæringListe: React.FunctionComponent<Props> = ({ næringer = [], onDelete, onEdit }) => {
    const næringLabel = (næring: NæringFormData): React.ReactNode => {
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('navn')}>
                    {onEdit && <ActionLink onClick={() => onEdit(næring)}>{næring.navnPåNæringen}</ActionLink>}
                    {!onEdit && <span>{næring.navnPåNæringen}</span>}
                </span>
            </div>
        );
    };

    return (
        <ItemList<NæringFormData>
            getItemId={(næring) => næring.organisasjonsnummer}
            getItemTitle={(næring) => næring.navnPåNæringen}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={næringLabel}
            items={næringer.filter((næring) => næring.id !== undefined)}
        />
    );
};

export default NæringListe;
