import { InputTime } from '@navikt/sif-common-formik/lib';
import { parse } from 'iso8601-duration';
import moize from 'moize';
import { ISODuration } from '../../types';

const _isoDurationToTime = (duration: string): Partial<InputTime> | undefined => {
    const parts = parse(duration);
    return parts
        ? {
              hours: `${parts.hours}`,
              minutes: `${parts.minutes}`,
          }
        : undefined;
};

export const ISODurationToInputTime = (duration: ISODuration): InputTime | undefined => {
    const time = _isoDurationToTime(duration);
    return {
        hours: time?.hours ? `${time?.hours}` : '0',
        minutes: time?.minutes ? `${time?.minutes}` : '0',
    };
};

const _inputTimeToISODuration = ({ hours, minutes }: Partial<InputTime>): string => {
    return `PT${hours || 0}H${minutes || 0}M`;
};

export const inputTimeToISODuration = moize(_inputTimeToISODuration);
