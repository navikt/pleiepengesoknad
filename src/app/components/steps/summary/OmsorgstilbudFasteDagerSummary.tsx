import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { iso8601DurationToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { OmsorgstilbudFasteDagerApi } from '../../../types/PleiepengesøknadApiData';

interface Props {
    fasteDager?: OmsorgstilbudFasteDagerApi;
}

const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};

const OmsorgstilbudFasteDagerSummary: React.FunctionComponent<Props> = ({ fasteDager }) => {
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
    return <>{intlHelper(intl, 'omsorgstilbud.ingenDagerValgt')}</>;
};

export default OmsorgstilbudFasteDagerSummary;