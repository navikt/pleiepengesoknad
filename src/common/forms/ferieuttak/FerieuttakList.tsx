import React from 'react';
import { Ferieuttak } from './types';
import ActionLink from 'common/components/action-link/ActionLink';
import { prettifyDateExtended } from 'common/utils/dateUtils';
import ItemList from 'common/components/item-list/ItemList';

interface Props {
    ferieuttak: Ferieuttak[];
    onEdit?: (opphold: Ferieuttak) => void;
    onDelete?: (opphold: Ferieuttak) => void;
}

const FerieuttakListe: React.FunctionComponent<Props> = ({ ferieuttak, onDelete, onEdit }) => {
    const getDateTitleString = (uttak: Ferieuttak) =>
        `${prettifyDateExtended(uttak.fom)} - ${prettifyDateExtended(uttak.tom)}`;

    const renderFerieuttakLabel = (uttak: Ferieuttak): React.ReactNode => {
        const title = getDateTitleString(uttak);
        return (
            <>
                {onEdit && <ActionLink onClick={() => onEdit(uttak)}>{title}</ActionLink>}
                {!onEdit && <span>{title}</span>}
            </>
        );
    };

    return (
        <ItemList<Ferieuttak>
            getItemId={(uttak) => uttak.id}
            getItemTitle={(uttak) => getDateTitleString(uttak)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderFerieuttakLabel}
            items={ferieuttak.filter((uttak) => uttak.id !== undefined)}
        />
    );
};

export default FerieuttakListe;
