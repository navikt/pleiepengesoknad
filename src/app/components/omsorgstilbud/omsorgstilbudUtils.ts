import { DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { OmsorgstilbudDag, TidIOmsorgstilbud } from './types';

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

export const getOmsorgstilbudDagFromTidIOmsorgstilbud = (
    tidIOmsorgstilbud: TidIOmsorgstilbud,
    tidsrom?: DateRange
): OmsorgstilbudDag[] => {
    const omsorgsdager: OmsorgstilbudDag[] = [];
    Object.keys(tidIOmsorgstilbud).forEach((isoDateString) => {
        const dato = ISOStringToDate(isoDateString);
        if (dato) {
            if (tidsrom && datoErInnenforTidsrom(dato, tidsrom) === false) {
                return false;
            }
            const tid = tidIOmsorgstilbud[isoDateString];
            if (tid) {
                omsorgsdager.push({
                    dato,
                    tid,
                });
            }
        }
        return false;
    });
    return omsorgsdager;
};
