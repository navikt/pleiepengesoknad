import {
    decimalDurationToDuration,
    Duration,
    durationAsNumberDuration,
    durationToDecimalDuration,
    DurationWeekdays,
    getPercentageOfDuration,
    NumberDuration,
    Weekday,
} from '@navikt/sif-common-utils/lib';

const allWeekdays: Weekday[] = [Weekday.monday, Weekday.tuesday, Weekday.wednesday, Weekday.thursday, Weekday.friday];

export const getPercentageOfDurationWeekdays = (percentage: number, weekdays: DurationWeekdays): DurationWeekdays => ({
    monday: weekdays.monday ? getPercentageOfDuration(weekdays.monday, percentage) : undefined,
    tuesday: weekdays.tuesday ? getPercentageOfDuration(weekdays.tuesday, percentage) : undefined,
    wednesday: weekdays.wednesday ? getPercentageOfDuration(weekdays.wednesday, percentage) : undefined,
    thursday: weekdays.thursday ? getPercentageOfDuration(weekdays.thursday, percentage) : undefined,
    friday: weekdays.friday ? getPercentageOfDuration(weekdays.friday, percentage) : undefined,
});

export const getNumberDurationOrUndefined = (duration?: Duration): NumberDuration | undefined => {
    if (duration && durationHasSomeDuration(duration)) {
        return durationAsNumberDuration(duration);
    }
    return undefined;
};

export const durationWeekdaysFromHoursPerWeek = (timer: number): DurationWeekdays => {
    const tidPerDag = decimalDurationToDuration(timer / 5);
    return {
        monday: tidPerDag,
        tuesday: tidPerDag,
        wednesday: tidPerDag,
        thursday: tidPerDag,
        friday: tidPerDag,
    };
};

export const durationHasSomeDuration = (duration: Duration | undefined): boolean => {
    if (!duration) {
        return false;
    }
    const dur = durationToDecimalDuration(duration);
    return dur > 0;
};

export const getWeekdaysWithDuration = (durationWeekdays: DurationWeekdays): Weekday[] => {
    return Object.keys(durationWeekdays)
        .filter((key) => durationWeekdays[key] !== undefined && durationToDecimalDuration(durationWeekdays[key]) > 0)
        .map((key) => key as Weekday);
};

/**
 *
 * @param durationWeekdays
 * @returns alle dager i uken som er undefined eller har 0 i varighet
 */
export const getAllWeekdaysWithoutDuration = (durationWeekdays: DurationWeekdays): Weekday[] => {
    const days: Weekday[] = [];
    allWeekdays.forEach((weekday) => {
        if (durationHasSomeDuration(durationWeekdays[weekday]) === false) {
            days.push(weekday);
        }
    });
    return days;
};

export const hasWeekdaysWithoutDuration = (durationWeekdays: DurationWeekdays): boolean =>
    allWeekdays.some((weekday) => durationHasSomeDuration(durationWeekdays[weekday]) === false);

export const removeDurationWeekdaysNotInDurationWeekdays = (
    weekdays1: DurationWeekdays,
    weekdays2: DurationWeekdays
): DurationWeekdays => {
    return {
        [Weekday.monday]: weekdays2.monday ? weekdays1.monday : undefined,
        [Weekday.tuesday]: weekdays2.tuesday ? weekdays1.tuesday : undefined,
        [Weekday.wednesday]: weekdays2.wednesday ? weekdays1.wednesday : undefined,
        [Weekday.thursday]: weekdays2.thursday ? weekdays1.thursday : undefined,
        [Weekday.friday]: weekdays2.friday ? weekdays1.friday : undefined,
    };
};

const getDurationOrUndefinedIfNoDuration = (duration?: Duration): Duration | undefined =>
    duration === undefined || durationHasSomeDuration(duration) === false ? undefined : duration;

export const removeDurationWeekdaysWithNoDuration = ({
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
}: DurationWeekdays): DurationWeekdays => {
    return {
        [Weekday.monday]: getDurationOrUndefinedIfNoDuration(monday),
        [Weekday.tuesday]: getDurationOrUndefinedIfNoDuration(tuesday),
        [Weekday.wednesday]: getDurationOrUndefinedIfNoDuration(wednesday),
        [Weekday.thursday]: getDurationOrUndefinedIfNoDuration(thursday),
        [Weekday.friday]: getDurationOrUndefinedIfNoDuration(friday),
    };
};
