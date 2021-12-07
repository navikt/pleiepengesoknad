import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { GjentagelseEnkeltdag, GjentagelseType } from './ArbeidstidEnkeltdagForm';
import { DatoTidMap, ISODate } from '../../types';
import { nthItemFilter } from '../../utils/common/arrayUtils';
import { dateToISODate } from '../../utils/common/isoDateUtils';
import { getDatesInDateRange, getMonthDateRange, getWeekDateRange } from '../../utils/common/dateRangeUtils';

const getDagerMedInterval = (interval: number, periode: DateRange) => {
    const ukedag = dayjs(periode.from).isoWeekday();
    const datoer = getDatesInDateRange(periode, true);
    const dager = datoer.filter((dato) => dayjs(dato).isoWeekday() === ukedag);
    return dager.filter((dag, index) => {
        return nthItemFilter(index, interval);
    });
};

const getGjentagendeDager = (endringsperiode: DateRange, dato: Date, gjentagelse?: GjentagelseEnkeltdag): ISODate[] => {
    if (gjentagelse) {
        let gjentagendeDager: Date[] = [];
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
            gjentagendeDager = getDatesInDateRange(getWeekDateRange(periode.from));
        }
        if (gjentagelse.gjentagelsetype === GjentagelseType.heleMåneden) {
            gjentagendeDager = getDatesInDateRange(getMonthDateRange(periode.from));
        }
        return gjentagendeDager.map((date) => dateToISODate(date));
    }
    return [dateToISODate(dato)];
};

export const getDagerMedNyArbeidstid = (
    endringsperiode: DateRange,
    dato: Date,
    varighet: InputTime,
    gjentagelse?: GjentagelseEnkeltdag
): DatoTidMap => {
    const datoerMedTid: DatoTidMap = {};
    const datoerSomSkalEndres = getGjentagendeDager(endringsperiode, dato, gjentagelse);
    datoerSomSkalEndres.forEach((isoDate) => {
        datoerMedTid[isoDate] = { varighet };
    });
    datoerMedTid[dateToISODate(dato)] = { varighet };
    return datoerMedTid;
};
