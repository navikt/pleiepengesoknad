import { IntlShape } from 'react-intl';
import intlHelper from './intlUtils';
import { Time } from 'app/types/Time';
import { parse } from 'iso8601-duration';

export const timeToIso8601Duration = ({ hours, minutes }: Partial<Time>): string => {
    return `PT${hours || 0}H${minutes || 0}M`;
};

export const iso8601DurationToTime = (duration: string): Partial<Time> | undefined => {
    const parts = parse(duration);

    return parts
        ? {
              hours: parts.hours,
              minutes: parts.minutes
          }
        : undefined;
};

export const decimalTimeToTime = (time: number): Time => {
    const hours = Math.floor(time);
    const minutes = Math.round(60 * (time % 1));
    return {
        hours,
        minutes
    };
};

export const timeToDecimalTime = (time: Time): number => {
    return (time.hours || 0) + ((100 / 60) * (time.minutes || 0)) / 100;
};

export const isValidTime = (time: Partial<Time> | undefined): time is Time => {
    return (
        time !== undefined &&
        time.hours !== undefined &&
        !isNaN(time.hours) &&
        time.minutes !== undefined &&
        !isNaN(time.minutes) &&
        time.minutes < 60
    );
};

export const timeToString = (time: Time, intl: IntlShape): string => {
    return intlHelper(intl, 'timerOgMinutter', { timer: time.hours, minutter: time.minutes });
};
