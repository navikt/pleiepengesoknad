import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { uniq } from 'lodash';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import moize from 'moize';
import { dateIsWeekDay, getFirstWeekDayInMonth, getLastWeekDayInMonth } from './dateUtils';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.extend(minMax);
dayjs.extend(isSameOrBefore);

const _getMonthsInDateRange = (range: DateRange): DateRange[] => {
    const months: DateRange[] = [];
    let current = dayjs(range.from);
    do {
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('month').toDate() };
        months.push({
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to, 'day') ? range.to : monthRange.to,
        });
        current = current.add(1, 'month').startOf('month');
    } while (current.isSameOrBefore(range.to, 'day'));
    return months;
};
export const getMonthsInDateRange = moize(_getMonthsInDateRange);

const _getWeeksInDateRange = (range: DateRange): DateRange[] => {
    const weeks: DateRange[] = [];
    let current = dayjs(range.from);
    do {
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('week').toDate() };
        weeks.push({
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to, 'day') ? range.to : monthRange.to,
        });
        current = current.add(1, 'week').startOf('week');
    } while (current.isBefore(range.to, 'day'));
    return weeks;
};
export const getWeeksInDateRange = moize(_getWeeksInDateRange);

export const getDatesInDateRange = (range: DateRange, onlyWeekDays = true): Date[] => {
    const dates: Date[] = [];
    let current = dayjs(range.from); //.subtract(dayjs(range.from).isoWeekday() - 1, 'days');
    do {
        const date = current.toDate();
        if (onlyWeekDays === false || dateIsWeekDay(date)) {
            dates.push(date);
        }
        current = current.add(1, 'day');
    } while (current.isSameOrBefore(range.to, 'day'));
    return dates;
};

export const getWeekDateRange = (date: Date, onlyWeekDays = false): DateRange => {
    return {
        from: dayjs(date).startOf('week').toDate(),
        to: dayjs(date)
            .endOf('week')
            .subtract(onlyWeekDays ? 2 : 0, 'days')
            .toDate(),
    };
};

export const getMonthDateRange = (date: Date, onlyWeekDays = false): DateRange => ({
    from: onlyWeekDays ? getFirstWeekDayInMonth(date) : dayjs(date).startOf('month').toDate(),
    to: onlyWeekDays ? getLastWeekDayInMonth(date) : dayjs(date).endOf('month').toDate(),
});

const _dateIsWithinDateRange = (date: Date, dateRange: DateRange): boolean => {
    return dayjs(date).isBetween(dateRange.from, dateRange.to, 'day', '[]');
};
export const dateIsWithinDateRange = moize(_dateIsWithinDateRange);

export const getNumberOfDaysInDateRange = (dateRange: DateRange, onlyWeekDays = false): number =>
    onlyWeekDays
        ? getDatesInDateRange(dateRange, true).length
        : Math.abs(dayjs(dateRange.to).diff(dateRange.from, 'days'));

export const getYearsInDateRanges = (dateRanges: DateRange[]): number[] =>
    uniq(dateRanges.map((d) => d.from.getFullYear()));

export const getDateRangesBetweenDateRanges = (dateRanges: DateRange[]): DateRange[] => {
    const rangesInBetween: DateRange[] = [];
    dateRanges.forEach((periode, index) => {
        if (index === 0) {
            return;
        }
        const rangeInBetween: DateRange = {
            from: dayjs(dateRanges[index - 1].to)
                .add(1, 'day')
                .toDate(),
            to: dayjs(periode.from).subtract(1, 'day').toDate(),
        };

        if (dayjs(rangeInBetween.from).isSameOrBefore(rangeInBetween.to, 'day')) {
            rangesInBetween.push(rangeInBetween);
        }
    });
    return rangesInBetween;
};

export const getDateRangeFromDateRanges = (ranges: DateRange[]): DateRange => {
    return {
        from: dayjs.min(ranges.map((range) => dayjs(range.from))).toDate(),
        to: dayjs.max(ranges.map((range) => dayjs(range.to))).toDate(),
    };
};
