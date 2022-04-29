import {
    DateDurationMap,
    durationToDecimalDuration,
    DurationWeekdays,
    getDatesWithDurationLongerThanZero,
    getWeekdayFromDate,
    getWeekdaysWithDuration,
    ISODateToDate,
    Weekday,
} from '@navikt/sif-common-utils/lib';

export const getDurationWeekdaysNotInDurationWeekdays = (
    weekdays1: DurationWeekdays,
    weekdays2: DurationWeekdays
): Weekday[] => {
    const diff: Weekday[] = [];
    Object.keys(weekdays2).forEach((weekday) => {
        const duration = weekdays2[weekday];
        if (duration && durationToDecimalDuration(duration) > 0 && weekdays1[weekday] === undefined) {
            diff.push(weekday as Weekday);
        }
    });
    return diff;
};

export const arbeiderFasteAndreDagerEnnNormalt = (normalt: DurationWeekdays, faktisk: DurationWeekdays = {}): boolean =>
    getDurationWeekdaysNotInDurationWeekdays(normalt, faktisk).length > 0;

export const arbeiderAndreEnkeltdagerEnnNormalt = (
    normalt: DurationWeekdays,
    enkeltdager: DateDurationMap = {}
): boolean => {
    const ukedager = getWeekdaysWithDuration(normalt);
    if (ukedager.length === 5) {
        return false; // Jobber alle ukedager
    }
    const dagerMedTid = getDatesWithDurationLongerThanZero(enkeltdager);
    const harDagerPåAndreDager = dagerMedTid.some((isoDate) => {
        const weekday = getWeekdayFromDate(ISODateToDate(isoDate));
        return weekday && ukedager.includes(weekday) === false;
    });
    return harDagerPåAndreDager;
};
