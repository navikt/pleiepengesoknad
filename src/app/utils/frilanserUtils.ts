import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export const isEndDateInPeriod = (periodeFra?: string, frilans_slutdato?: string): boolean => {
    dayjs.extend(isSameOrAfter);
    dayjs.extend(customParseFormat);

    if (periodeFra && frilans_slutdato) {
        return dayjs(periodeFra, 'YYYY-MM-DD', true).isValid() && dayjs(frilans_slutdato, 'YYYY-MM-DD', true).isValid()
            ? dayjs(frilans_slutdato).isSameOrAfter(periodeFra, 'day')
            : false;
    }
    return false;
};
