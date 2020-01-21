import React from 'react';
import { Utenlandsopphold } from './types';
import ItemList from '../../components/item-list/ItemList';
import { prettifyDateExtended } from '../../utils/dateUtils';
import { getCountryName } from '../../components/country-select/CountrySelect';
import { useIntl } from 'react-intl';
import ActionLink from '../../components/action-link/ActionLink';
import bemUtils from '../../utils/bemUtils';

import './utenlandsoppholdListe.less';

interface Props {
    utenlandsopphold: Utenlandsopphold[];
    onEdit?: (opphold: Utenlandsopphold) => void;
    onDelete?: (opphold: Utenlandsopphold) => void;
}

const bem = bemUtils('utenlandsoppholdListe');

const UtenlandsoppholdListe: React.FunctionComponent<Props> = ({ utenlandsopphold, onDelete, onEdit }) => {
    const intl = useIntl();
    const renderUtenlandsoppholdLabel = (opphold: Utenlandsopphold): React.ReactNode => {
        const navn = getCountryName(opphold.countryCode, intl.locale);
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('land')}>
                    {onEdit && <ActionLink onClick={() => onEdit(opphold)}>{navn}</ActionLink>}
                    {!onEdit && <span>{navn}</span>}
                </span>
                <span className={bem.element('dato')}>
                    {prettifyDateExtended(opphold.fromDate)} - {prettifyDateExtended(opphold.toDate)}
                </span>
            </div>
        );
    };

    return (
        <ItemList<Utenlandsopphold>
            getItemId={(opphold) => opphold.id}
            getItemTitle={(opphold) => getCountryName(opphold.countryCode, intl.locale)}
            onDelete={onDelete}
            onEdit={onEdit}
            labelRenderer={renderUtenlandsoppholdLabel}
            items={utenlandsopphold}
        />
    );
};

export default UtenlandsoppholdListe;
