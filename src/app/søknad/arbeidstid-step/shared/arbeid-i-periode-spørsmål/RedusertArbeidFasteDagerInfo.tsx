import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { DurationWeekdays, summarizeDurationInDurationWeekdays } from '@navikt/sif-common-utils/lib';
import { getPercentageOfDurationWeekdays } from '../../../../utils/durationWeekdaysUtils';
import DurationWeekdaysList from '../components/DurationWeekdaysList';
import { TimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';

interface Props {
    arbeiderHvor: string;
    jobberProsent?: number;
    arbeidNormalt?: DurationWeekdays;
}

const RedusertArbeidFasteDagerInfo: React.FunctionComponent<Props> = ({
    arbeiderHvor,
    jobberProsent,
    arbeidNormalt,
}) => {
    if (arbeidNormalt === undefined || jobberProsent === undefined) {
        return null;
    }
    const redusertUke = getPercentageOfDurationWeekdays(jobberProsent, arbeidNormalt);
    const totalt = summarizeDurationInDurationWeekdays(redusertUke);
    return (
        <Box margin="l">
            <ExpandableInfo title="Hvor mange timer utgjør dette hver dag?">
                <p>
                    Ut i fra hvor mye du har sagt du jobber normalt {arbeiderHvor} når du ikke har fravær på grunn av
                    pleiepenger, vil {jobberProsent} prosent arbeid i perioden utgjøre:
                </p>
                <DurationWeekdaysList weekdays={redusertUke} />
                <p>
                    Totalt <TimerOgMinutter timer={totalt.hours} minutter={totalt.minutes} /> hver uke.
                </p>
            </ExpandableInfo>
        </Box>
    );
};

export default RedusertArbeidFasteDagerInfo;
