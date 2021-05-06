import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { TilsynsordningApi, TilsynsordningApiJa, TilsynVetPeriodeApi } from '../../../types/PleiepengesøknadApiData';

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
    const { tilsyn } = tilsynsordning.ja;

    if (tilsyn) {
        const days = Object.keys(tilsyn).filter((day) => tilsyn[day] !== undefined);

        const daysSummary = days.map((day) => {
            const time = iso8601DurationToTime(tilsyn[day]);
            return `${intlHelper(intl, `${day}.caps`)}: ${time ? formatTime(intl, time) : 0}`;
        });
        if (daysSummary.length > 0) {
            return daysSummary.join('. ');
        }
    }

    return intlHelper(intl, 'tilsynsordning.ingenDagerValgt');
};

const TilsynsordningSummary = ({ tilsynsordning }: Props) => {
    const intl = useIntl();
    const { svar } = tilsynsordning;
    console.log(tilsynsordning);
    return (
        <>
            <Box margin="l">
                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.spm')}>
                    <FormattedMessage id={`tilsynsordning.svar.${svar}`} />
                </ContentWithHeader>
            </Box>
            {tilsynsordning.svar === 'ja' && (
                <>
                    <Box margin="l">
                        {tilsynsordning.ja && (
                            <ContentWithHeader
                                header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.hvorMyeTidOms.spm')}>
                                {tilsynsordning.ja.hvorMyeTid === TilsynVetPeriodeApi.VET_HELE_PERIODEN && (
                                    <>
                                        <FormattedMessage id="steg.oppsummering.tilsynsordning.hvorMyeTidOms.vetHelePerioden" />
                                        <Box margin="m">{summarizeDaysInWeek(tilsynsordning, intl)}</Box>
                                    </>
                                )}
                                {tilsynsordning.ja.hvorMyeTid === TilsynVetPeriodeApi.USIKKER && (
                                    <>
                                        <FormattedMessage id="steg.oppsummering.tilsynsordning.hvorMyeTidOms.usikker" />
                                        <Box margin="l">
                                            <ContentWithHeader
                                                header={intlHelper(
                                                    intl,
                                                    'steg.oppsummering.tilsynsordning.vetMinimumAntalTimer.spm'
                                                )}>
                                                {tilsynsordning.ja.vetMinAntalTimer && (
                                                    <>
                                                        <FormattedMessage id="steg.oppsummering.tilsynsordning.vetMinimumAntalTimer.ja" />
                                                        <Box margin="m">
                                                            {summarizeDaysInWeek(tilsynsordning, intl)}
                                                        </Box>
                                                    </>
                                                )}
                                                {!tilsynsordning.ja.vetMinAntalTimer && (
                                                    <>
                                                        <FormattedMessage id="steg.oppsummering.tilsynsordning.vetMinimumAntalTimer.nei" />
                                                    </>
                                                )}
                                            </ContentWithHeader>
                                        </Box>
                                    </>
                                )}
                                {tilsynsordning.ja.hvorMyeTid === TilsynVetPeriodeApi.NEI && (
                                    <FormattedMessage id="steg.oppsummering.tilsynsordning.hvorMyeTidOms.nei" />
                                )}
                            </ContentWithHeader>
                        )}
                    </Box>
                </>
            )}
        </>
    );
};

export default TilsynsordningSummary;
