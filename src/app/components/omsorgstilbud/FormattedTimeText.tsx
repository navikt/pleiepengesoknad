import React from 'react';
import { FormattedNumber } from 'react-intl';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { Time } from '@navikt/sif-common-formik';

const ensureTime = (time: Partial<Time>): Time => {
    return {
        hours: time.hours || '0',
        minutes: time.minutes || '0',
    };
};

const FormattedTimeText = ({
    time,
    fullText,
    hideEmptyValues = false,
    decimal,
}: {
    time: Partial<Time>;
    fullText?: boolean;
    hideEmptyValues?: boolean;
    decimal?: boolean;
}): JSX.Element => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    if (decimal) {
        return (
            <>
                <FormattedNumber value={timeToDecimalTime(ensureTime(time))} maximumFractionDigits={2} />
                {` `}t.
            </>
        );
    }
    return (
        <>
            {hideEmptyValues && timer === '0' && minutter !== '0' ? null : (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {timer} {fullText ? 'timer' : 't.'}
                </span>
            )}
            {` `}
            {hideEmptyValues && minutter === '0' && timer !== '0' ? null : (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {minutter} {fullText ? 'minutter' : 'm.'}
                </span>
            )}
        </>
    );
};

export default FormattedTimeText;
