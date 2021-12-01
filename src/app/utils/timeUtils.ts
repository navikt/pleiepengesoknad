import { InputTime } from '@navikt/sif-common-formik/lib';
import { parse } from 'iso8601-duration';
import moize from 'moize';

export const _timeToISODuration = ({ hours, minutes }: Partial<InputTime>): string => {
    return `PT${hours || 0}H${minutes || 0}M`;
};
export const timeToISODuration = moize(_timeToISODuration);

export const _isoDurationToTime = (duration: string): Partial<InputTime> | undefined => {
    const parts = parse(duration);

    return parts
        ? {
              hours: `${parts.hours}`,
              minutes: `${parts.minutes}`,
          }
        : undefined;
};
export const isoDurationToTime = moize(_isoDurationToTime);

export const ensureTime = (time: Partial<InputTime>): InputTime => {
    return {
        hours: time.hours || '0',
        minutes: time.minutes || '0',
    };
};
