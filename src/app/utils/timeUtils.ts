import { InjectedIntl } from 'react-intl';
import intlHelper from './intlUtils';
import { Time } from 'app/types/Time';

export const convertHoursToIso8601Duration = (time: number): string => {
    const { hours, minutes } = convertHoursToHoursAndMinutes(time);
    return `PT${hours}H${minutes}M`;
};

export const convertHoursToHoursAndMinutes = (time: number): Time => {
    const hours = Math.floor(time);
    const minutes = Math.round(60 * (time % 1));
    return {
        hours,
        minutes
    };
};

export const getDecimalTimeFromTime = (time: Time): number => {
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

export const timeToString = (time: Time, intl: InjectedIntl): string => {
    return intlHelper(intl, 'timerOgMinutter', { timer: time.hours, minutter: time.minutes });
};
