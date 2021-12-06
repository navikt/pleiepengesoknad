import { prettifyDate, prettifyDateExtended, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import moize from 'moize';

const _formatDayName = moize((date: Date) => {
    return `${dayjs(date).format('dddd')}`;
});

const _formatDefault = moize((date: Date) => {
    return prettifyDate(date);
});

const _formatExtended = moize((date: Date) => {
    return prettifyDateExtended(date);
});

const _formatFull = moize((date: Date) => {
    return prettifyDateFull(date);
});

const _formatFullWithDayName = moize((date: Date) => {
    return `${dayjs(date).format('dddd')} ${prettifyDateFull(date)}`;
});

const _dateDayAndMonth = moize((date) => dayjs(date).format('dddd DD. MMM'));
const _dateDayAndMonthShort = moize((date) => {
    return `${dayjs(date).format('dddd').substr(0, 3)}. ${dayjs(date).format('DD.MM.')}`;
});

const dateFormatter = {
    dayName: _formatDayName,
    short: _formatDefault,
    extended: _formatExtended,
    full: _formatFull,
    fullWithDayName: _formatFullWithDayName,
    dayDateAndMonth: _dateDayAndMonth,
    dayDateAndMonthShort: _dateDayAndMonthShort,
};

export default dateFormatter;
