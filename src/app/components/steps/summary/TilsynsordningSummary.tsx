import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@sif-common/core/components/box/Box';
import ContentWithHeader from '@sif-common/core/components/content-with-header/ContentWithHeader';
import TextareaSummary from '@sif-common/core/components/textarea-summary/TextareaSummary';
import { Time } from '@sif-common/core/types/Time';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { iso8601DurationToTime } from '@sif-common/core/utils/timeUtils';
import { hasValue } from '@sif-common/core/validation/hasValue';
import { TilsynsordningApi, TilsynsordningApiJa } from '../../../types/PleiepengesøknadApiData';
import { TilsynVetIkkeHvorfor } from '../../../types/PleiepengesøknadFormData';

interface Props {
    tilsynsordning: TilsynsordningApi;
}

const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
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

const summarizeDaysInWeek = (tilsynsordning: TilsynsordningApiJa, intl: IntlShape): string => {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ja: { tilleggsinformasjon, ...allDays },
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

const TilsynsordningSummary = ({ tilsynsordning }: Props) => {
    const intl = useIntl();
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
                                        __html: tilsynsordning.ja.tilleggsinformasjon.replace(/\n/, '<br/>'),
                                    }}
                                />
                            </ContentWithHeader>
                        </Box>
                    )}
                </>
            )}
            {tilsynsordning.svar === 'vetIkke' && (
                <>
                    <Box margin="l">
                        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.vetIkke.header')}>
                            <FormattedMessage
                                id={`steg.oppsummering.tilsynsordning.vetIkke.årsak.${tilsynsordning.vetIkke.svar}`}
                            />
                            {TilsynVetIkkeHvorfor.annet === tilsynsordning.vetIkke.svar &&
                                tilsynsordning.vetIkke.annet && <TextareaSummary text={tilsynsordning.vetIkke.annet} />}
                        </ContentWithHeader>
                    </Box>
                </>
            )}
        </>
    );
};

export default TilsynsordningSummary;
