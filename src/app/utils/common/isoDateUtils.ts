import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import moize from 'moize';
import { ISODate, ISODateRange } from '../../types';

const _dateToISODate = (date: Date): ISODate => dayjs(date).format('YYYY-MM-DD');

const _getISOWeekdayFromISODate = (isoDate: ISODate): number => {
    return dayjs(ISODateToDate(isoDate)).isoWeekday();
};
export const getISOWeekdayFromISODate = moize(_getISOWeekdayFromISODate);

const _ISODateToDate = (isoDate: ISODate): Date => {
    return apiStringDateToDate(isoDate);
};
export const ISODateToDate = moize(_ISODateToDate);

export const ISODateRangeToDateRange = (isoDateRange: ISODateRange): DateRange => {
    const parts = isoDateRange.split('/');
    return {
        from: ISODateToDate(parts[0]),
        to: ISODateToDate(parts[1]),
    };
};

export const ISODateRangeToISODates = (isoDateRange: ISODateRange): { from: ISODate; to: ISODate } => {
    const parts = isoDateRange.split('/');
    return {
        from: parts[0],
        to: parts[1],
    };
};

export const dateRangeToISODateRange = (dateRange: DateRange): ISODateRange => {
    return `${dateToISODate(dateRange.from)}/${dateToISODate(dateRange.to)}`;
};

export const dateToISODate = moize(_dateToISODate, {
    isSerialized: true,
    serializer: (args) => [args[0].toDateString()],
});

export const getISODatesInISODateRangeWeekendExcluded = (range: ISODateRange): ISODate[] => {
    const dateRange = ISODateRangeToDateRange(range);
    const { from, to } = dateRange;
    let currentDate = dayjs(from);
    const dates: ISODate[] = [];
    do {
        const weekday = currentDate.isoWeekday();
        if (weekday <= 5) {
            dates.push(dateToISODate(currentDate.toDate()));
        }
        currentDate = dayjs(currentDate).add(1, 'day');
    } while (dayjs(currentDate).isSameOrBefore(to, 'day'));
    return dates;
};
