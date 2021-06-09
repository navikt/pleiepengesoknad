import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { OmsorgstilbudDag } from './types';

dayjs.extend(isBetween);

export const getOmsorgsdagerIPeriode = (omsorgsdager: OmsorgstilbudDag[], periode: DateRange): OmsorgstilbudDag[] =>
    omsorgsdager.filter((dag) => dag && dayjs(dag.dato).isBetween(periode.from, periode.to, 'day', '[]'));

export const getMonthsInDateRange = (range: DateRange): DateRange[] => {
    const months: DateRange[] = [];
    let current = dayjs(range.from);
    do {
        const monthRange: DateRange = { from: current.toDate(), to: current.endOf('month').toDate() };
        months.push({
            from: monthRange.from,
            to: dayjs(monthRange.to).isAfter(range.to) ? range.to : monthRange.to,
        });
        current = current.add(1, 'month').startOf('month');
    } while (current.isBefore(range.to));
    return months;
};
