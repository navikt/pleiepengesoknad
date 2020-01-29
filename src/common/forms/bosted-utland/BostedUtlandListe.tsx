import React from 'react';
import ItemList from '../../components/item-list/ItemList';
import { prettifyDateExtended } from '../../utils/dateUtils';
import { getCountryName } from '../../components/country-select/CountrySelect';
import { useIntl } from 'react-intl';
import ActionLink from '../../components/action-link/ActionLink';
import bemUtils from '../../utils/bemUtils';
import { BostedUtland } from './types';

import './bostedUtlandListe.less';

interface Props {
    bosteder: BostedUtland[];
    onEdit?: (opphold: BostedUtland) => void;
    onDelete?: (opphold: BostedUtland) => void;
}

const bem = bemUtils('bostedUtlandListe');

const BostedUtlandListe: React.FunctionComponent<Props> = ({ bosteder, onDelete, onEdit }) => {
    const intl = useIntl();
    const renderBostedUtlandLabel = (opphold: BostedUtland): React.ReactNode => {
        const navn = getCountryName(opphold.landkode, intl.locale);
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('land')}>
                    {onEdit && <ActionLink onClick={() => onEdit(opphold)}>{navn}</ActionLink>}
                    {!onEdit && <span>{navn}</span>}
                </span>
                <span className={bem.element('dato')}>
                    {prettifyDateExtended(opphold.fom)} - {prettifyDateExtended(opphold.tom)}
                </span>
            </div>
        );
    };

    return (
        <ItemList<BostedUtland>
            getItemId={(opphold) => opphold.id}
            getItemTitle={(opphold) => getCountryName(opphold.landkode, intl.locale)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderBostedUtlandLabel}
            items={bosteder}
        />
    );
};

export default BostedUtlandListe;
