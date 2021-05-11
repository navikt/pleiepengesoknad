import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { OmsorgstilbudApi } from '../../../types/PleiepengesøknadApiData';

interface Props {
    omsorgstilbud?: OmsorgstilbudApi;
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

const summarizeDaysInWeek = (omsorgstilbud: OmsorgstilbudApi, intl: IntlShape): string => {
    const { fasteDager } = omsorgstilbud;

    if (fasteDager) {
        const days = Object.keys(fasteDager).filter((day) => fasteDager[day] !== undefined);

        const daysSummary = days.map((day) => {
            const time = iso8601DurationToTime(fasteDager[day]);
            return `${intlHelper(intl, `${day}.caps`)}: ${time ? formatTime(intl, time) : 0}`;
        });
        if (daysSummary.length > 0) {
            return daysSummary.join('. ');
        }
    }

    return intlHelper(intl, 'tilsynsordning.ingenDagerValgt');
};

const TilsynsordningSummary = ({ omsorgstilbud }: Props) => {
    const intl = useIntl();
    const svar = omsorgstilbud ? 'ja' : 'nei';
    console.log(omsorgstilbud);
    return (
        <>
            <Box margin="l">
                <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.spm')}>
                    <FormattedMessage id={`tilsynsordning.svar.${svar}`} />
                </ContentWithHeader>
            </Box>
            {omsorgstilbud && (
                <>
                    <Box margin="l">
                        <ContentWithHeader
                            header={intlHelper(intl, 'steg.oppsummering.tilsynsordning.hvorMyeTidOms.spm')}>
                            {omsorgstilbud.vetAlleTimer && (
                                <>
                                    <FormattedMessage id="steg.oppsummering.tilsynsordning.hvorMyeTidOms.vetHelePerioden" />
                                    <Box margin="m">{summarizeDaysInWeek(omsorgstilbud, intl)}</Box>
                                </>
                            )}
                            {!omsorgstilbud.vetAlleTimer && (
                                <>
                                    <FormattedMessage id="steg.oppsummering.tilsynsordning.hvorMyeTidOms.usikker" />
                                    <Box margin="l">
                                        <ContentWithHeader
                                            header={intlHelper(
                                                intl,
                                                'steg.oppsummering.tilsynsordning.vetMinimumAntallTimer.spm'
                                            )}>
                                            {omsorgstilbud.vetNoenTimer && (
                                                <>
                                                    <FormattedMessage id="steg.oppsummering.tilsynsordning.vetMinimumAntallTimer.ja" />
                                                    <Box margin="m">{summarizeDaysInWeek(omsorgstilbud, intl)}</Box>
                                                </>
                                            )}
                                            {!omsorgstilbud.vetNoenTimer && (
                                                <>
                                                    <FormattedMessage id="steg.oppsummering.tilsynsordning.vetMinimumAntallTimer.nei" />
                                                </>
                                            )}
                                        </ContentWithHeader>
                                    </Box>
                                </>
                            )}
                        </ContentWithHeader>
                    </Box>
                </>
            )}
        </>
    );
};

export default TilsynsordningSummary;
