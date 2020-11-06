import React from 'react';
import { FormattedMessage } from 'react-intl';
import SummaryList from '@sif-common/core/components/summary-list/SummaryList';
import { UtenlandsoppholdÅrsak } from '@sif-common/forms/utenlandsopphold/types';
import bemUtils from '@sif-common/core/utils/bemUtils';
import { apiStringDateToDate, prettifyDateExtended } from '@sif-common/core/utils/dateUtils';
import {
    BostedUtlandApiData,
    FerieuttakIPeriodeApiData,
    isUtenlandsoppholdUtenforEØSApiData,
    PeriodeBarnetErInnlagtApiFormat,
    UtenlandsoppholdIPeriodenApiData,
} from 'app/types/PleiepengesøknadApiData';
import './utenlandsoppholdSummaryItem.less';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

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
        <>
            <Box>
                <span className={bem.element('dates')}>
                    {prettifyDateExtended(apiStringDateToDate(opphold.fraOgMed))} -{' '}
                    {prettifyDateExtended(apiStringDateToDate(opphold.tilOgMed))}
                </span>
                <span className={bem.element('country')}>{opphold.landnavn}</span>
            </Box>
            {isUtenlandsoppholdUtenforEØSApiData(opphold) && opphold.erBarnetInnlagt === true && (
                <Box margin="l">
                    {opphold.perioderBarnetErInnlagt !== undefined && opphold.perioderBarnetErInnlagt.length > 0 && (
                        <>
                            <FormattedMessage id={`utenlandsopphold.form.perioderBarnetErInnlag.listTitle`} />:
                            <SummaryList
                                items={opphold.perioderBarnetErInnlagt}
                                itemRenderer={(periode: PeriodeBarnetErInnlagtApiFormat) => (
                                    <>
                                        {prettifyDateExtended(apiStringDateToDate(periode.fraOgMed))} -{' '}
                                        {prettifyDateExtended(apiStringDateToDate(periode.tilOgMed))}
                                    </>
                                )}></SummaryList>
                        </>
                    )}
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
                </Box>
            )}
        </>
    );
};
