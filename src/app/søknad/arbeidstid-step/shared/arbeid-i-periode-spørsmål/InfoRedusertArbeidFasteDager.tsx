import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import {
    DurationWeekdays,
    getPercentageOfDurationWeekdays,
    summarizeDurationInDurationWeekdays,
} from '@navikt/sif-common-utils/lib';
import DurationWeekdaysList from '../../../../components/duration-weekdays-list/DurationWeekdaysList';
import { TimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';

interface Props {
    arbeiderHvor: string;
    prosent?: number;
    arbeidNormalt?: DurationWeekdays;
}

const InfoRedusertArbeidFasteDager: React.FunctionComponent<Props> = ({ arbeiderHvor, prosent, arbeidNormalt }) => {
    if (arbeidNormalt === undefined || prosent === undefined) {
        return null;
    }
    const redusertUke = getPercentageOfDurationWeekdays(prosent, arbeidNormalt);
    const totalt = summarizeDurationInDurationWeekdays(redusertUke);
    return (
        <Box margin="l">
            <ExpandableInfo title="Hvor mange timer utgjør dette hver dag?">
                <p>
                    Ut i fra hvor mye du har sagt du jobber normalt {arbeiderHvor} når du ikke har fravær på grunn av
                    pleiepenger, vil {prosent} prosent arbeid i perioden utgjøre:
                </p>
                <DurationWeekdaysList weekdays={redusertUke} />
                <p>
                    Totalt <TimerOgMinutter timer={totalt.hours} minutter={totalt.minutes} /> hver uke.
                </p>
            </ExpandableInfo>
        </Box>
    );
};

export default InfoRedusertArbeidFasteDager;
