import React from 'react';
import { prettifyDateExtended, apiStringDateToDate } from 'common/utils/dateUtils';
import bemUtils from 'common/utils/bemUtils';
import {
    BostedUtlandApiData,
    UtenlandsoppholdIPeriodenApiData,
    isUtenlandsoppholdUtenforEØSApiData,
    FerieuttakIPeriodeApiData
} from 'app/types/PleiepengesøknadApiData';
import './utenlandsoppholdSummaryItem.less';
import { FormattedMessage } from 'react-intl';
import { UtenlandsoppholdÅrsak } from 'common/forms/utenlandsopphold/types';

const bem = bemUtils('utenlandsoppholdSummaryItem');

export const renderFerieuttakIPeriodenSummary = (ferieuttak: FerieuttakIPeriodeApiData): React.ReactNode => (
    <div className={bem.block}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(apiStringDateToDate(ferieuttak.fra_og_med))} -{' '}
            {prettifyDateExtended(apiStringDateToDate(ferieuttak.til_og_med))}
        </span>
    </div>
);

export const renderUtenlandsoppholdSummary = (opphold: BostedUtlandApiData): React.ReactNode => (
    <div className={bem.block}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(apiStringDateToDate(opphold.fra_og_med))} -{' '}
            {prettifyDateExtended(apiStringDateToDate(opphold.til_og_med))}
        </span>
        <span className={bem.element('country')}>{opphold.landnavn}</span>
    </div>
);

export const renderUtenlandsoppholdIPeriodenSummary = (opphold: UtenlandsoppholdIPeriodenApiData): React.ReactNode => {
    return (
        <div className={bem.block}>
            <span className={bem.element('dates')}>
                {prettifyDateExtended(apiStringDateToDate(opphold.fra_og_med))} -{' '}
                {prettifyDateExtended(apiStringDateToDate(opphold.til_og_med))}
            </span>
            <span className={bem.element('country')}>{opphold.landnavn}</span>
            {isUtenlandsoppholdUtenforEØSApiData(opphold) && opphold.er_barnet_innlagt === true && (
                <div className={bem.element('details')}>
                    {opphold.arsak !== UtenlandsoppholdÅrsak.ANNET && (
                        <FormattedMessage
                            id={`utenlandsopphold.form.årsak.${opphold.arsak}`}
                            values={{ land: opphold.landnavn }}
                        />
                    )}
                    {opphold.arsak === UtenlandsoppholdÅrsak.ANNET && (
                        <FormattedMessage id={`utenlandsopphold.oppsummering.årsak.ANNET`} />
                    )}
                </div>
            )}
        </div>
    );
};
