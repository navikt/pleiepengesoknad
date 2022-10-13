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

export const getWeekOfYearInfoFromDateRange = (dateRange: DateRange): WeekOfYearInfo => {
    return {
        dateRange,
        year: dateRange.from.getFullYear(),
        weekNumber: dayjs(dateRange.from).week(),
    };
};
