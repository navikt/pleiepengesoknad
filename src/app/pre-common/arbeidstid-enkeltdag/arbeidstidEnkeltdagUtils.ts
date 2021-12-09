import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { GjentagelseEnkeltdag, GjentagelseType } from './ArbeidstidEnkeltdagForm';
import { DatoTidMap, ISODate } from '../../types';
import { nthItemFilter } from '../../utils/common/arrayUtils';
import { dateToISODate } from '../../utils/common/isoDateUtils';
import { getDatesInDateRange, getMonthDateRange, getWeekDateRange } from '../../utils/common/dateRangeUtils';
import { dateIsWeekDay } from '../../utils/common/dateUtils';

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
        let gjentagendeDatoer: Date[] = [];
        const periode: DateRange = {
            from: dato,
            to: gjentagelse.tom || endringsperiode.to,
        };
        if (gjentagelse.gjentagelsetype === GjentagelseType.hverUke) {
            gjentagendeDatoer = getDagerMedInterval(1, periode);
        }
        if (gjentagelse.gjentagelsetype === GjentagelseType.hverAndreUke) {
            gjentagendeDatoer = getDagerMedInterval(2, periode);
        }
        if (gjentagelse.gjentagelsetype === GjentagelseType.heleUken) {
            gjentagendeDatoer = getDatesInDateRange(getWeekDateRange(periode.from), true);
        }
        if (gjentagelse.gjentagelsetype === GjentagelseType.heleMåneden) {
            gjentagendeDatoer = getDatesInDateRange(getMonthDateRange(periode.from), true);
        }
        return gjentagendeDatoer.filter(dateIsWeekDay).map((date) => dateToISODate(date));
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
