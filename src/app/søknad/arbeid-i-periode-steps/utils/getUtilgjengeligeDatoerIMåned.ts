import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { getDatesInDateRange } from '../../../utils/common/dateRangeUtils';

export const getUtilgjengeligeDatoerIMåned = (månedDato: Date, periode: DateRange): Date[] => {
    const måned: DateRange = {
        from: dayjs(månedDato).startOf('month').toDate(),
        to: dayjs(månedDato).endOf('month').toDate(),
    };
    const periodeFørFørsteDag: DateRange = {
        from: dayjs.min(dayjs(periode.from), dayjs(måned.from)).toDate(),
        to: dayjs(periode.from).subtract(1, 'day').toDate(),
    };
    const dagerFørFørsteDag = dayjs(måned.from).isSame(periode.from, 'month')
        ? getDatesInDateRange(periodeFørFørsteDag)
        : [];

    const dagerEtterSisteDag = dayjs(måned.from).isSame(periode.to, 'month')
        ? getDatesInDateRange({
              from: dayjs(periode.to).add(1, 'day').toDate(),
              to: måned.to,
          })
        : [];

    return [...dagerFørFørsteDag, ...dagerEtterSisteDag];
};
