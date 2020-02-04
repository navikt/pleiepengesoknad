import React from 'react';
import { VirksomhetFormData } from './types';
import ActionLink from 'common/components/action-link/ActionLink';
import ItemList from 'common/components/item-list/ItemList';
import bemUtils from 'common/utils/bemUtils';

import './virksomhetListe.less';

interface Props {
    virksomheter: VirksomhetFormData[];
    onEdit?: (virksomhet: VirksomhetFormData) => void;
    onDelete?: (virksomhet: VirksomhetFormData) => void;
}

const bem = bemUtils('virksomhetListe');

const VirksomhetListe: React.FunctionComponent<Props> = ({ virksomheter = [], onDelete, onEdit }) => {
    const renderVirksomhetLabel = (virksomhet: VirksomhetFormData): React.ReactNode => {
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('navn')}>
                    {onEdit && <ActionLink onClick={() => onEdit(virksomhet)}>{virksomhet.navn}</ActionLink>}
                    {!onEdit && <span>{virksomhet.navn}</span>}
                </span>
            </div>
        );
    };

    return (
        <ItemList<VirksomhetFormData>
            getItemId={(virksomhet) => virksomhet.orgnummer}
            getItemTitle={(virksomhet) => virksomhet.navn}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderVirksomhetLabel}
            items={virksomheter.filter((virksomhet) => virksomhet.id !== undefined)}
        />
    );
};

export default VirksomhetListe;
