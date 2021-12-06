import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { Daginfo } from '../../components/tid-uker-input/types';
import { getDagInfoForPeriode } from '../../components/tid-uker-input/utils';
import { GjentagelseEnkeltdag, GjentagelseType } from './ArbeidstidEnkeltdagForm';
import { DatoTidMap, ISODate } from '../../types';
import { nthItemFilter } from '../../utils/common/arrayUtils';
import { dateToISODate, getISOWeekdayFromISODate } from '../../utils/common/isoDateUtils';
import { getMonthDateRange, getWeekDateRange } from '../../utils/common/dateRangeUtils';

const getDagerMedInterval = (interval: number, periode: DateRange) => {
    const ukedag = dayjs(periode.from).isoWeekday();
    const dagerIPeriodenDetErSøktFor = getDagInfoForPeriode(periode);
    const dager = dagerIPeriodenDetErSøktFor.filter((dag) => getISOWeekdayFromISODate(dag.isoDateString) === ukedag);
    return dager.filter((dag, index) => {
        return nthItemFilter(index, interval);
    });
};

const getGjentagendeDager = (endringsperiode: DateRange, dato: Date, gjentagelse?: GjentagelseEnkeltdag): ISODate[] => {
    if (gjentagelse) {
        let gjentagendeDager: Daginfo[] = [];
        const periode: DateRange = {
            from: dato,
            to: gjentagelse.tom || endringsperiode.to,
        };
        if (gjentagelse.gjentagelsetype === GjentagelseType.hverUke) {
            gjentagendeDager = getDagerMedInterval(1, periode);
        }
        if (gjentagelse.gjentagelsetype === GjentagelseType.hverAndreUke) {
            gjentagendeDager = getDagerMedInterval(2, periode);
        }
        if (gjentagelse.gjentagelsetype === GjentagelseType.heleUken) {
            gjentagendeDager = getDagInfoForPeriode(getWeekDateRange(periode.from));
        }
        if (gjentagelse.gjentagelsetype === GjentagelseType.heleMåneden) {
            gjentagendeDager = getDagInfoForPeriode(getMonthDateRange(periode.from));
        }
        return gjentagendeDager.map((dag) => dag.isoDateString);
    }
    return [dateToISODate(dato)];
};

export const getDagerMedNyArbeidstid = (
    endringsperiode: DateRange,
    dato: Date,
    tid: InputTime,
    gjentagelse?: GjentagelseEnkeltdag
): DatoTidMap => {
    const datoerMedTid: DatoTidMap = {};
    const datoerSomSkalEndres = getGjentagendeDager(endringsperiode, dato, gjentagelse);
    datoerSomSkalEndres.forEach((isoDate) => {
        datoerMedTid[isoDate] = { tid };
    });
    datoerMedTid[dateToISODate(dato)] = { tid };
    return datoerMedTid;
};
