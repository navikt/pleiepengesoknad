import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Time } from '@navikt/sif-common-formik/lib';

export const formatTime = (intl: IntlShape, time: Partial<Time>): string => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return intlHelper(intl, 'timerOgMinutter', { timer, minutter });
};

interface Props {
    timer?: string | number;
    minutter?: string | number;
}

const TimerOgMinutter: React.FunctionComponent<Props> = ({ timer, minutter }) => {
    const intl = useIntl();
    return <span>{intlHelper(intl, 'timerOgMinutter', { timer: timer || '0', minutter: minutter || '0' })}</span>;
};

export default TimerOgMinutter;
