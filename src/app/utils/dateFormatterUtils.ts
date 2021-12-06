import { prettifyDate, prettifyDateExtended, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import moize from 'moize';

export const _formatDayName = moize((date: Date) => {
    return `${dayjs(date).format('dddd')}`;
});

export const _formatDefault = moize((date: Date) => {
    return prettifyDate(date);
});

export const _formatExtended = moize((date: Date) => {
    return prettifyDateExtended(date);
});

export const _formatFull = moize((date: Date) => {
    return prettifyDateFull(date);
});

export const _formatFullWithDayName = moize((date: Date) => {
    return `${dayjs(date).format('dddd')} ${prettifyDateFull(date)}`;
});

export const _dateDayAndMonth = moize((date) => dayjs(date).format('dddd DD. MMM'));

const dateFormatter = {
    dayName: _formatDayName,
    short: _formatDefault,
    extended: _formatExtended,
    full: _formatFull,
    fullWithDayName: _formatFullWithDayName,
    dayDateAndMonth: _dateDayAndMonth,
};

export default dateFormatter;
