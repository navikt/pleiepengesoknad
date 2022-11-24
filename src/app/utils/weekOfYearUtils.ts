import { DateRange } from '@navikt/sif-common-formik/lib';
import { dateRangeToISODateRange, dateRangeUtils, ISODateRange } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { WorkWeekInfo } from '../types/WorkWeekInfo';

dayjs.extend(weekOfYear);

export type WeekOfYearMapKey = ISODateRange;

export const getWeekOfYearKey = (dateRange: DateRange): WeekOfYearMapKey => {
    return dateRangeToISODateRange(dateRange);
};

export const getNumberOfDaysInWeek = (dateRange: DateRange): number => {
    return dayjs(dateRange.to).isoWeekday() - dayjs(dateRange.from).isoWeekday() + 1;
};

export const getDateRangeWorkingDays = ({ from, to }: DateRange): DateRange | undefined => {
    const startIsoWeekday = dayjs(from).isoWeekday();
    if (startIsoWeekday > 5) {
        return undefined;
    }
    const endIsoWeekday = dayjs(to).isoWeekday();
    if (endIsoWeekday <= 5) {
        return {
            from,
            to,
        };
    }
    return { from, to: dayjs(from).startOf('isoWeek').add(4, 'days').toDate() };
};

export const getWorkWeekInfoFromDateRange = (dateRange: DateRange): WorkWeekInfo => {
    const dateRangeWorkingDays = getDateRangeWorkingDays(dateRange);
    const numberOfWorkdays = dateRangeUtils.getNumberOfDaysInDateRange(dateRange, true);
    return {
        year: dateRange.from.getFullYear(),
        dateRange: dateRange,
        weekNumber: dayjs(dateRange.from).week(),
        dateRangeWorkingDays,
        isFullWorkWeek: numberOfWorkdays === 5,
    };
};
