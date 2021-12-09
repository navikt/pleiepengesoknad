import React from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { InputTime } from '@navikt/sif-common-formik';
import { ensureTime } from '../../utils/common/inputTimeUtils';

const FormattedTimeText = ({
    time,
    fullText,
    hideEmptyValues = false,
    type,
}: {
    time: Partial<InputTime>;
    fullText?: boolean;
    hideEmptyValues?: boolean;
    type?: 'digital' | 'decimal' | 'standard';
}): JSX.Element => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    const intl = useIntl();

    if (type === 'decimal') {
        return (
            <>
                <FormattedNumber value={timeToDecimalTime(ensureTime(time))} maximumFractionDigits={2} />
                {` `}t.
            </>
        );
    } else if (type === 'digital') {
        return (
            <>
                {timer}:{minutter}
            </>
        );
    }
    return (
        <span>
            {hideEmptyValues && timer === '0' && minutter !== '0' ? null : (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {fullText ? (
                        intlHelper(intl, 'timer', { timer })
                    ) : (
                        <>
                            {timer} <span aria-label="timer">t. </span>
                        </>
                    )}
                </span>
            )}
            {` `}
            {hideEmptyValues && minutter === '0' && timer !== '0' ? null : (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {fullText ? (
                        intlHelper(intl, 'minutter', { minutter })
                    ) : (
                        <>
                            {minutter} <span aria-label="minutter">m. </span>
                        </>
                    )}
                </span>
            )}
        </span>
    );
};

export default FormattedTimeText;
