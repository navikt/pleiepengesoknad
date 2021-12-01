import React from 'react';
import { FormattedNumber, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { InputTime } from '@navikt/sif-common-formik';
import { ensureTime } from '../../utils/timeUtils';

const FormattedTimeText = ({
    time,
    fullText,
    hideEmptyValues = false,
    decimal,
}: {
    time: Partial<InputTime>;
    fullText?: boolean;
    hideEmptyValues?: boolean;
    decimal?: boolean;
}): JSX.Element => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    const intl = useIntl();

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
                    {fullText ? intlHelper(intl, 'timer', { timer }) : <>{timer} t.</>}
                </span>
            )}
            {` `}
            {hideEmptyValues && minutter === '0' && timer !== '0' ? null : (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {fullText ? intlHelper(intl, 'minutter', { minutter }) : <>{minutter} m.</>}
                </span>
            )}
        </>
    );
};

export default FormattedTimeText;
