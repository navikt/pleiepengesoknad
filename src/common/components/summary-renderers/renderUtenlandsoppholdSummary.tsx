import React from 'react';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { prettifyDateExtended } from 'common/utils/dateUtils';
import bemUtils from 'common/utils/bemUtils';
import CountryName from '../country-name/CountryName';
import './utenlandsoppholdSummaryItem.less';

const bem = bemUtils('utenlandsoppholdSummaryItem');

export const renderUtenlandsoppholdSummary = (opphold: Utenlandsopphold): React.ReactNode => (
    <div className={bem.block}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(opphold.fromDate)} - {prettifyDateExtended(opphold.toDate)}
        </span>
        <span className={bem.element('country')}>
            <CountryName countryCode={opphold.countryCode} />
        </span>
    </div>
);
