import React from 'react';
import { FormattedMessage } from 'react-intl';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import { UtenlandsoppholdÅrsak } from 'common/forms/utenlandsopphold/types';
import bemUtils from 'common/utils/bemUtils';
import { apiStringDateToDate, prettifyDateExtended } from 'common/utils/dateUtils';
import {
    BostedUtlandApiData,
    FerieuttakIPeriodeApiData,
    isUtenlandsoppholdUtenforEØSApiData,
    PeriodeBarnetErInnlagtApiFormat,
    UtenlandsoppholdIPeriodenApiData,
} from 'app/types/PleiepengesøknadApiData';
import './utenlandsoppholdSummaryItem.less';

const bem = bemUtils('utenlandsoppholdSummaryItem');

export const renderFerieuttakIPeriodenSummary = (ferieuttak: FerieuttakIPeriodeApiData): React.ReactNode => (
    <div className={bem.classNames(bem.block, bem.modifier('no-details'))}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(apiStringDateToDate(ferieuttak.fraOgMed))} -{' '}
            {prettifyDateExtended(apiStringDateToDate(ferieuttak.tilOgMed))}
        </span>
    </div>
);

export const renderUtenlandsoppholdSummary = (opphold: BostedUtlandApiData): React.ReactNode => (
    <div className={bem.block}>
        <span className={bem.element('dates')}>
            {prettifyDateExtended(apiStringDateToDate(opphold.fraOgMed))} -{' '}
            {prettifyDateExtended(apiStringDateToDate(opphold.tilOgMed))}
        </span>
        <span className={bem.element('country')}>{opphold.landnavn}</span>
    </div>
);

export const renderUtenlandsoppholdIPeriodenSummary = (opphold: UtenlandsoppholdIPeriodenApiData): React.ReactNode => {
    return (
        <div className={bem.block}>
            <span className={bem.element('dates')}>
                {prettifyDateExtended(apiStringDateToDate(opphold.fraOgMed))} -{' '}
                {prettifyDateExtended(apiStringDateToDate(opphold.tilOgMed))}
            </span>
            <span className={bem.element('country')}>{opphold.landnavn}</span>
            {isUtenlandsoppholdUtenforEØSApiData(opphold) && opphold.erBarnetInnlagt === true && (
                <>
                    {opphold.perioderBarnetErInnlagt !== undefined && opphold.perioderBarnetErInnlagt.length > 0 && (
                        <div className={bem.element('details')}>
                            <FormattedMessage id={`utenlandsopphold.form.perioderBarnetErInnlag.listTitle`} />:
                            <SummaryList
                                items={opphold.perioderBarnetErInnlagt}
                                itemRenderer={(periode: PeriodeBarnetErInnlagtApiFormat) => (
                                    <>
                                        {prettifyDateExtended(apiStringDateToDate(periode.fraOgMed))} -{' '}
                                        {prettifyDateExtended(apiStringDateToDate(periode.tilOgMed))}
                                    </>
                                )}></SummaryList>
                        </div>
                    )}
                    <div className={bem.element('details')}>
                        <FormattedMessage id={`utenlandsopphold.form.årsak.spm`} values={{ land: opphold.landnavn }} />{' '}
                        {opphold.årsak !== UtenlandsoppholdÅrsak.ANNET && (
                            <FormattedMessage
                                id={`utenlandsopphold.form.årsak.${opphold.årsak}`}
                                values={{ land: opphold.landnavn }}
                            />
                        )}
                        {opphold.årsak === UtenlandsoppholdÅrsak.ANNET && (
                            <FormattedMessage id={`utenlandsopphold.oppsummering.årsak.ANNET`} />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
