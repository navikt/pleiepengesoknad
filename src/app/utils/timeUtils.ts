import { HoursAndMinutes } from 'app/types/HoursAndMinutes';
import { Time } from 'app/components/time-input-base/TimeInputBase';

export const convertHoursToIso8601Duration = (time: number): string => {
    const { hours, minutes } = convertHoursToHoursAndMinutes(time);
    return `PT${hours}H${minutes}M`;
};

export const convertHoursToHoursAndMinutes = (time: number): HoursAndMinutes => {
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
