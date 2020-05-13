import React from 'react';
import { TilsynsordningApi, TilsynsordningApiJa } from '../../../types/PleiepengesøknadApiData';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import intlHelper from 'common/utils/intlUtils';
import { useIntl, FormattedMessage, IntlShape } from 'react-intl';
import { TilsynVetIkkeHvorfor } from '../../../types/PleiepengesøknadFormData';
import { Time } from 'common/types/Time';
import TextareaSummary from 'common/components/textarea-summary/TextareaSummary';
import { iso8601DurationToTime } from 'common/utils/timeUtils';
import { hasValue } from 'common/validation/hasValue';

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

const TilsynsordningSummary: React.FunctionComponent<Props> = ({ tilsynsordning }) => {
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
                                        __html: tilsynsordning.ja.tilleggsinformasjon.replace(/\n/, '<br/>')
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
