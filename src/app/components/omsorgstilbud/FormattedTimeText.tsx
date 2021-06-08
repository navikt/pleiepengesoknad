import React from 'react';
import { Time } from '@navikt/sif-common-formik/lib';

const FormattedTimeText = ({
    time,
    fullText,
    hideEmptyValues = false,
}: {
    time: Partial<Time>;
    fullText?: boolean;
    hideEmptyValues?: boolean;
}): JSX.Element => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return (
        <>
            {hideEmptyValues && timer === '0' && minutter !== '0' ? null : (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {timer} {fullText ? 'timer' : 'tim.'}
                </span>
            )}
            {` `}
            {hideEmptyValues && minutter === '0' && timer !== '0' ? null : (
                <span style={{ whiteSpace: 'nowrap' }}>
                    {minutter} {fullText ? 'minutter' : 'min.'}
                </span>
            )}
        </>
    );
};

export default FormattedTimeText;
