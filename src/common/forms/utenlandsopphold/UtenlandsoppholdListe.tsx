import React from 'react';
import { Utenlandsopphold } from './types';
import ItemList from '../../components/item-list/ItemList';
import { prettifyDateExtended } from '../../utils/dateUtils';
import { getCountryName } from '../../components/country-select/CountrySelect';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import ActionLink from '../../components/action-link/ActionLink';
import bemUtils from '../../utils/bemUtils';

import './utenlandsoppholdListe.less';

interface Props {
    utenlandsopphold: Utenlandsopphold[];
    onEdit?: (opphold: Utenlandsopphold) => void;
    onDelete?: (opphold: Utenlandsopphold) => void;
}

const bem = bemUtils('utenlandsoppholdListe');

const UtenlandsoppholdListe: React.FunctionComponent<Props & InjectedIntlProps> = ({
    utenlandsopphold,
    onDelete,
    onEdit,
    intl
}) => {
    const getUtenlandsopphold = (id: string): Utenlandsopphold | undefined => {
        return utenlandsopphold.find((u) => u.id === id);
    };

    const renderUtenlandsoppholdLabel = (id: string): React.ReactNode => {
        const opphold = getUtenlandsopphold(id);
        if (!opphold) {
            return <div>"N/A"</div>;
        }
        const navn = getCountryName(opphold.countryCode, intl.locale);
        return (
            <div className={bem.element('label')}>
                <span className={bem.element('land')}>
                    {onEdit && <ActionLink onClick={() => handleEdit(id)}>{navn}</ActionLink>}
                    {!onEdit && <span>{navn}</span>}
                </span>
                <span className={bem.element('dato')}>
                    {prettifyDateExtended(opphold.fromDate)} - {prettifyDateExtended(opphold.toDate)}
                </span>
            </div>
        );
    };

    const handleEdit = (id: string) => {
        if (onEdit) {
            const opphold = getUtenlandsopphold(id);
            if (opphold) {
                onEdit(opphold);
            }
        }
    };

    const handleDelete = (id: string) => {
        if (onDelete) {
            const opphold = getUtenlandsopphold(id);
            if (opphold) {
                onDelete(opphold);
            }
        }
    };

    return (
        <ItemList
            onDelete={onDelete ? handleDelete : undefined}
            onEdit={onEdit ? handleEdit : undefined}
            labelRenderer={renderUtenlandsoppholdLabel}
            items={utenlandsopphold
                .filter((u) => u.id !== undefined)
                .map((u) => ({
                    id: u.id!,
                    label: getCountryName(u.countryCode, intl.locale)
                }))}
        />
    );
};

export default injectIntl(UtenlandsoppholdListe);
