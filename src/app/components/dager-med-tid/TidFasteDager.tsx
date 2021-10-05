import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { TidFasteDagerApiData } from '../../types/PleiepengesøknadApiData';

interface Props {
    fasteDager?: TidFasteDagerApiData;
}

const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};

const TidFasteDager: React.FunctionComponent<Props> = ({ fasteDager }) => {
    const intl = useIntl();

    if (fasteDager) {
        const days = Object.keys(fasteDager).filter((day) => fasteDager[day] !== undefined);
        if (days.length > 0) {
            return (
                <ul style={{ marginTop: 0 }}>
                    {days.map((day, idx) => {
                        const time = iso8601DurationToTime(fasteDager[day]);
                        return (
                            <li key={idx} style={{ marginBottom: '.25rem' }}>
                                {`${intlHelper(intl, `${day}er.caps`)}: ${time ? formatTime(intl, time) : 0}`}
                            </li>
                        );
                    })}
                </ul>
            );
        }
    }
    return <>{intlHelper(intl, 'dagerMedTid.ingenDagerRegistrert')}</>;
};

export default TidFasteDager;
