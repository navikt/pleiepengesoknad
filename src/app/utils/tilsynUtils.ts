import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { OmsorgstilbudFasteDager } from '../types/PleiepengesøknadFormData';

export const sumTimerMedTilsyn = (uke: OmsorgstilbudFasteDager): number => {
    return Object.keys(uke).reduce((timer: number, key: string) => {
        return timer + timeToDecimalTime(uke[key]);
    }, 0);
};

export const getMaxTimerMedTilsynOneDay = (
    uke: OmsorgstilbudFasteDager
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
              day,
          }
        : undefined;
};
