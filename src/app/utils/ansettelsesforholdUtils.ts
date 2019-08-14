import { HoursOrPercent } from 'app/types/Søkerdata';

export const calculateRedusertArbeidsuke = (
    normal: number,
    redusert: number,
    pstEllerTimer: HoursOrPercent
): number => {
    if (pstEllerTimer === HoursOrPercent.hours) {
        return redusert;
    }
    const reducedHours = (normal / 100) * redusert;
    return parseFloat(reducedHours.toFixed(2));
};
