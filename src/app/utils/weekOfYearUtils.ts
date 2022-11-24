import { DateRange } from '@navikt/sif-common-formik/lib';
import { dateRangeToISODateRange, ISODateRange } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { WeekOfYearInfo } from '../types/WeekOfYear';

dayjs.extend(weekOfYear);

export type WeekOfYearMapKey = ISODateRange;

export const getWeekOfYearKey = (dateRange: DateRange): WeekOfYearMapKey => {
    return dateRangeToISODateRange(dateRange);
};

export const getNumberOfWorkdaysInWeek = (dateRange: DateRange): number => {
    return Math.min(5, dayjs(dateRange.to).isoWeekday()) - dayjs(dateRange.from).isoWeekday() + 1;
};

export const getNumberOfDaysInWeek = (dateRange: DateRange): number => {
    return dayjs(dateRange.to).isoWeekday() - dayjs(dateRange.from).isoWeekday() + 1;
};

export const getWeekOfYearInfoFromDateRange = (dateRange: DateRange): WeekOfYearInfo => {
    const numberOfWorkdays = getNumberOfWorkdaysInWeek(dateRange);
    const numberOfDaysInWeek = getNumberOfDaysInWeek(dateRange);
    return {
        dateRange,
        year: dateRange.from.getFullYear(),
        weekNumber: dayjs(dateRange.from).week(),
        isFullWeek: numberOfWorkdays === 5,
        numberOfWorkdays,
        numberOfDaysInWeek,
    };
};
