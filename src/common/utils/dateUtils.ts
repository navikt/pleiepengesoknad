import moment from 'moment';
import { ApiStringDate } from 'common/types/ApiStringDate';

const apiDateFormat = 'YYYY-MM-DD';
const prettyDateFormat = 'DD.MM.YYYY';
const prettyDateFormatExtended = 'DD. MMM YYYY';

export const formatDateToApiFormat = (date: Date): ApiStringDate => {
    const apiFormattedDate = moment(date).format(apiDateFormat);
    return apiFormattedDate;
};
export const prettifyDate = (date: Date): string => moment(date).format(prettyDateFormat);
export const prettifyDateExtended = (date: Date) => moment(date).format(prettyDateFormatExtended);
export const apiStringDateToDate = (date: ApiStringDate): Date => moment(date, apiDateFormat).toDate();

export const date3YearsAgo = moment()
    .subtract(3, 'years')
    .startOf('day');

export const isMoreThan3YearsAgo = (date: Date) => moment(date).isBefore(date3YearsAgo);

export const dateToISOFormattedDateString = (date?: Date) =>
    date ? moment.utc(date).format(apiDateFormat) : undefined;

export const date1YearAgo = moment()
    .subtract(1, 'years')
    .startOf('day')
    .toDate();

export const date1YearFromNow = moment()
    .add(1, 'years')
    .endOf('day')
    .toDate();

export const dateToday = moment().toDate();

export const sortDateRange = (d1: DateRange, d2: DateRange): number => {
    if (moment(d1.from).isSameOrBefore(d2.from)) {
        return -1;
    }
    return 1;
};

export interface DateRange {
    from: Date;
    to: Date;
}
export const dateRangesCollide = (ranges: DateRange[]): boolean => {
    if (ranges.length > 0) {
        const sortedDates = ranges.sort(sortDateRange);
        const hasOverlap = ranges.find((d, idx) => {
            if (idx < sortedDates.length - 1) {
                return moment(d.to).isAfter(sortedDates[idx + 1].from);
            }
            return false;
        });
        return hasOverlap !== undefined;
    }
    return false;
};

export const dateRangesExceedsRange = (ranges: DateRange[], allowedRange: DateRange): boolean => {
    if (ranges.length === 0) {
        return false;
    }
    const sortedRanges = ranges.sort(sortDateRange);
    const from = sortedRanges[0].from;
    const to = sortedRanges[sortedRanges.length - 1].to;

    if (
        !moment(from).isBetween(allowedRange.from, allowedRange.to, 'day', '[]') ||
        !moment(to).isBetween(allowedRange.from, allowedRange.to, 'day', '[]')
    ) {
        return true;
    }
    return false;
};
