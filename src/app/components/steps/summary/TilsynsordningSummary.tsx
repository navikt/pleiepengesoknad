import React from 'react';
import { TilsynsordningApi, TilsynsordningApiJa } from '../../../types/PleiepengesøknadApiData';
import Box from '../../box/Box';
import ContentWithHeader from '../../content-with-header/ContentWithHeader';
import intlHelper from '../../../utils/intlUtils';
import { injectIntl, InjectedIntlProps, FormattedMessage, InjectedIntl } from 'react-intl';
import { hasValue } from '../../../validation/fieldValidations';
import { TilsynVetIkkeHvorfor } from '../../../types/PleiepengesøknadFormData';
import { Time } from '../../../types/Time';
import TextareaSummary from '../../textarea-summary/TextareaSummary';
import { iso8601DurationToTime } from '../../../utils/timeUtils';

interface Props {
    tilsynsordning: TilsynsordningApi;
}

const formatTime = (intl: InjectedIntl, time: Partial<Time>): string => {
    const { hours, minutes } = time;
    if (hours && minutes) {
        return intl.formatMessage({ id: 'tilsynsordning.timerPerDag.timerOgMinutter' }, time);
    } else if (hours) {
        return intl.formatMessage({ id: 'tilsynsordning.timerPerDag.timer' }, { hours });
    } else if (minutes) {
        return intl.formatMessage({ id: 'tilsynsordning.timerPerDag.minutter' }, { minutes });
    }
    return '';
};

const summarizeDaysInWeek = (tilsynsordning: TilsynsordningApiJa, intl: InjectedIntl): string => {
    const {
        ja: { tilleggsinformasjon, ...allDays }
    } = tilsynsordning;
    const days = Object.keys(allDays).filter((day) => allDays[day] !== undefined);
    const daysSummary = days.map((day) => {
        const time = iso8601DurationToTime(allDays[day]);
        return `${intlHelper(intl, `${day}.caps`)}: ${time ? formatTime(intl, time) : 0}`;
    });
    if (daysSummary.length > 0) {
        return daysSummary.join('. ');
    }
    return intlHelper(intl, 'tilsynsordning.ingenDagerValgt');
};

const TilsynsordningSummary: React.FunctionComponent<Props & InjectedIntlProps> = ({ tilsynsordning, intl }) => {
    const { svar } = tilsynsordning;
    return (
        <>
            <Box margin="l">
                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.header')}>
                    <FormattedMessage id={`tilsynsordning.svar.${svar}`} />
                </ContentWithHeader>
            </Box>
            {tilsynsordning.svar === 'ja' && (
                <>
                    <Box margin="l">
                        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.ja.header')}>
                            {tilsynsordning.ja ? (
                                summarizeDaysInWeek(tilsynsordning, intl)
                            ) : (
                                <FormattedMessage id="tilsynsordning.ingenDagerValgt" />
                            )}
                        </ContentWithHeader>
                    </Box>
                    {tilsynsordning.ja.tilleggsinformasjon && hasValue(tilsynsordning.ja.tilleggsinformasjon) && (
                        <Box margin="l">
                            <ContentWithHeader
                                header={intlHelper(
                                    intl,
                                    'steg.oppsummering.tilsynsordning.ja.tilleggsinformasjon.header'
                                )}>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: tilsynsordning.ja.tilleggsinformasjon.replace(/\n/, '<br/>')
                                    }}
                                />
                            </ContentWithHeader>
                        </Box>
                    )}
                </>
            )}
            {tilsynsordning.svar === 'vet_ikke' && (
                <>
                    <Box margin="l">
                        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.vetIkke.header')}>
                            <FormattedMessage
                                id={`steg.oppsummering.tilsynsordning.vetIkke.årsak.${tilsynsordning.vet_ikke.svar}`}
                            />
                            {TilsynVetIkkeHvorfor.annet === tilsynsordning.vet_ikke.svar &&
                                tilsynsordning.vet_ikke.annet && (
                                    <TextareaSummary text={tilsynsordning.vet_ikke.annet} />
                                )}
                        </ContentWithHeader>
                    </Box>
                </>
            )}
        </>
    );
};

export default injectIntl(TilsynsordningSummary);
