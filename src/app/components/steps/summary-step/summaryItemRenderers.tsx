import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { apiStringDateToDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { UtenlandsoppholdÅrsak } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import {
    BostedUtlandApiData,
    FerieuttakIPeriodeApiData,
    isUtenlandsoppholdUtenforEØSApiData,
    PeriodeBarnetErInnlagtApiData,
    UtenlandsoppholdIPeriodenApiData,
} from '../../../types/PleiepengesøknadApiData';

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
                                itemRenderer={(periode: PeriodeBarnetErInnlagtApiData) => (
                                    <>
                                        {prettifyDateExtended(apiStringDateToDate(periode.fraOgMed))} -{' '}
                                        {prettifyDateExtended(apiStringDateToDate(periode.tilOgMed))}
                                    </>
                                )}></SummaryList>
                        </>
                    )}

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
