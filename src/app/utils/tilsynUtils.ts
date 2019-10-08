import { Tilsynsuke } from '../types/PleiepengesøknadFormData';
import { timeToDecimalTime } from './timeUtils';

export const sumTimerMedTilsyn = (uke: Tilsynsuke): number => {
    return Object.keys(uke).reduce((timer: number, key: string) => {
        return timer + timeToDecimalTime(uke[key]);
    }, 0);
};

export const getMaxTimerMedTilsynOneDay = (
    uke: Tilsynsuke
): { maxHours: number; day: string | undefined } | undefined => {
    let maxHours = 0;
    let day;
    Object.keys(uke).forEach((key) => {
        const hours = timeToDecimalTime(uke[key]);
        if (hours > maxHours) {
            maxHours = hours;
            day = key;
        }
    });
    return day !== undefined
        ? {
              maxHours,
              day
          }
        : undefined;
};
