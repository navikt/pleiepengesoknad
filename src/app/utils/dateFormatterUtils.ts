import { prettifyDate, prettifyDateExtended, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import moize from 'moize';

export const _formatDefault = moize((date: Date) => {
    return prettifyDate(date);
});
export const _formatExtended = moize((date: Date) => {
    return prettifyDateExtended(date);
});
export const _formatFull = moize((date: Date) => {
    return prettifyDateFull(date);
});
export const _dateDayAndMonth = moize((date) => dayjs(date).format('dddd DD. MMM'));

const dateFormatter = {
    short: _formatDefault,
    extended: _formatExtended,
    full: _formatFull,
    dayDateAndMonth: _dateDayAndMonth,
};

export default dateFormatter;
