import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

export const getMonthsInDateRange = (range: DateRange): DateRange[] => {
    const months: DateRange[] = [];
    let current = dayjs(range.from);
    do {
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('month').toDate() };
        months.push({
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to, 'day') ? range.to : monthRange.to,
        });
        current = current.add(1, 'month').startOf('month');
    } while (current.isBefore(range.to, 'day'));
    return months;
};

export const getWeeksInDateRange = (range: DateRange): DateRange[] => {
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

export const erUkeFørSammeEllerEtterDenneUken = (week: DateRange): 'før' | 'samme' | 'etter' | undefined => {
    if (dayjs(week.from).isAfter(dateToday, 'day')) {
        return 'etter';
    }
    if (dayjs(week.to).isBefore(dateToday, 'day')) {
        return 'før';
    }
    if (dayjs(dateToday).isBetween(week.from, week.to, 'day', '[]')) {
        return 'samme';
    }
    return undefined;
};

export const søkerKunHelgedager = (fom?: string, tom?: string): boolean => {
    if (fom && tom) {
        const fomDayJs = dayjs(fom);
        const tomDayJs = dayjs(tom);

        return (fomDayJs.day() === 0 || fomDayJs.day() === 6) && fomDayJs.isSame(tomDayJs, 'day')
            ? true
            : fomDayJs.day() === 6 && tomDayJs.isSame(fomDayJs.add(1, 'd'), 'day')
            ? true
            : false;
    }
    return false;
};
