import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import { ISODuration, ISODurationToDuration } from '@navikt/sif-common-utils';
import { Time } from '../../../types/Time';

interface TidFasteDagerType {
    mandag?: ISODuration;
    tirsdag?: ISODuration;
    onsdag?: ISODuration;
    torsdag?: ISODuration;
    fredag?: ISODuration;
}

interface Props {
    fasteDager?: TidFasteDagerType;
}

const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};

const TidFasteDager: React.FunctionComponent<Props> = ({ fasteDager }) => {
    const intl = useIntl();

    if (fasteDager) {
        const days = Object.keys(fasteDager).filter((day) => (fasteDager as any)[day] !== undefined);
        if (days.length > 0) {
            return (
                <ul style={{ marginTop: 0 }}>
                    {days.map((day, idx) => {
                        const time = ISODurationToDuration((fasteDager as any)[day]);
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
