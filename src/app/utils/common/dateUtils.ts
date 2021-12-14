import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import moize from 'moize';
import { getMonthDateRange } from './dateRangeUtils';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);

export const getDatesInMonth = (month: Date, onlyWeekDays = false): Date[] => {
    const dates: Date[] = [];
    const range = getMonthDateRange(month);
    let current = dayjs(range.from);
    do {
        const date = current.toDate();
        if (onlyWeekDays === false || dateIsWeekDay(date)) {
            dates.push(date);
        }
        current = current.add(1, 'day');
    } while (current.isSameOrBefore(range.to, 'day'));
    return dates;
};

export const getLastWeekDayInMonth = (month: Date): Date => {
    return dayjs(month).endOf('month').startOf('week').add(4, 'days').toDate();
};

export const getFirstWeekDayInMonth = (month: Date): Date => {
    const firstDay = dayjs(month).startOf('month');
    if (firstDay.isoWeekday() > 5) {
        return firstDay.add(8 - firstDay.isoWeekday(), 'days').toDate();
    }
    return firstDay.toDate();
};

export const isDateInDates = (date: Date, dates?: Date[]): boolean => {
    if (!dates) {
        return false;
    }
    return dates.some((d) => dayjs(date).isSame(d, 'day'));
};

const _dateIsWeekDay = (date: Date): boolean => {
    return dayjs(date).isoWeekday() <= 5;
};
export const dateIsWeekDay = moize(_dateIsWeekDay);

const _getYearMonthKey = (date: Date): string => dayjs(date).format('YYYY-MM');
export const getYearMonthKey = moize(_getYearMonthKey);
