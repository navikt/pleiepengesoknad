import React from 'react';
import { useIntl } from 'react-intl';
import { formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';
import { DurationWeekdays } from '@navikt/sif-common-utils/lib';

interface Props {
    weekdays: DurationWeekdays;
}

const DurationWeekdaysList: React.FunctionComponent<Props> = ({ weekdays }) => {
    const intl = useIntl();
    const noDurationString = '0 timer';
    return (
        <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
            <li>Mandag: {weekdays.monday ? formatTimerOgMinutter(intl, weekdays.monday) : noDurationString}</li>
            <li>Tirsdag: {weekdays.tuesday ? formatTimerOgMinutter(intl, weekdays.tuesday) : noDurationString}</li>
            <li>Onsdag: {weekdays.wednesday ? formatTimerOgMinutter(intl, weekdays.wednesday) : noDurationString}</li>
            <li>Torsdag: {weekdays.thursday ? formatTimerOgMinutter(intl, weekdays.thursday) : noDurationString}</li>
            <li>Fredag: {weekdays.friday ? formatTimerOgMinutter(intl, weekdays.friday) : noDurationString}</li>
        </ul>
    );

    return null;
};

export default DurationWeekdaysList;
