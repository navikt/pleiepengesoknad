import { HoursAndMinutes } from 'app/types/HoursAndMinutes';

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
