import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { getDagInfoForPeriode } from '../components/tid-uker-input/utils';

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
        ? getDagInfoForPeriode(periodeFørFørsteDag).map((d) => d.dato)
        : [];

    const dagerEtterSisteDag = dayjs(måned.from).isSame(periode.to, 'month')
        ? getDagInfoForPeriode({
              from: dayjs(periode.to).add(1, 'day').toDate(),
              to: måned.to,
          }).map((d) => d.dato)
        : [];

    return [...dagerFørFørsteDag, ...dagerEtterSisteDag];
};
