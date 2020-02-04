import React from 'react';
import { FrilansoppdragFormData } from './types';
import ActionLink from 'common/components/action-link/ActionLink';
import { prettifyDateExtended } from 'common/utils/dateUtils';
import ItemList from 'common/components/item-list/ItemList';
import bemUtils from 'common/utils/bemUtils';
import './frilansoppdragListe.less';

interface Props {
    oppdrag: FrilansoppdragFormData[];
    onEdit?: (opphold: FrilansoppdragFormData) => void;
    onDelete?: (opphold: FrilansoppdragFormData) => void;
}

const bem = bemUtils('frilansoppdragListe');

const FrilansoppdragListe: React.FunctionComponent<Props> = ({ oppdrag, onDelete, onEdit }) => {
    const renderOppdragLabel = (o: FrilansoppdragFormData): React.ReactNode => {
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('navn')}>
                    {onEdit && <ActionLink onClick={() => onEdit(o)}>{o.arbeidsgiverNavn}</ActionLink>}
                    {!onEdit && <span>{o.arbeidsgiverNavn}</span>}
                </span>
                <span className={bem.element('dato')}>
                    {prettifyDateExtended(o.fom)}
                    {`${o.tom ? `- ${prettifyDateExtended(o.tom)}` : ''}`}
                </span>
            </div>
        );
    };

    return (
        <ItemList<FrilansoppdragFormData>
            getItemId={(o) => o.id}
            getItemTitle={(o) => o.arbeidsgiverNavn}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderOppdragLabel}
            items={oppdrag.filter((o) => o.id !== undefined)}
        />
    );
};

export default FrilansoppdragListe;
