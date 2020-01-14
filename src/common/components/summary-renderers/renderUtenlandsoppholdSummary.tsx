import React from 'react';
import { prettifyDateExtended, apiStringDateToDate } from 'common/utils/dateUtils';
import bemUtils from 'common/utils/bemUtils';
import { UtenlandsoppholdApiData } from 'app/types/PleiepengesøknadApiData';
import './utenlandsoppholdSummaryItem.less';

const bem = bemUtils('utenlandsoppholdSummaryItem');

export const renderUtenlandsoppholdSummary = (opphold: UtenlandsoppholdApiData): React.ReactNode => (
    <div className={bem.block}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(apiStringDateToDate(opphold.fra_og_med))} -{' '}
            {prettifyDateExtended(apiStringDateToDate(opphold.til_og_med))}
        </span>
        <span className={bem.element('country')}>{opphold.landnavn}</span>
    </div>
);
