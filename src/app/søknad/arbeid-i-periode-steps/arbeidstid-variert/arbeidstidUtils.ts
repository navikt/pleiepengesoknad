import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { Daginfo } from '../../../components/tid-uker-input/types';
import { getDagInfoForPeriode } from '../../../components/tid-uker-input/utils';
import {
    ArbeidstidEnkeltdagEndring,
    GjentagelseType,
} from '../../../pre-common/arbeidstid-enkeltdag/ArbeidstidEnkeltdagForm';
import { ISODate } from '../../../types';
import { nthItemFilter } from '../../../utils/arrayUtils';
import { dateToISODate, getISOWeekdayFromISODate, getMonthDateRange, getWeekDateRange } from '../../../utils/dateUtils';

export const getDagerMedInterval = (interval: number, periode: DateRange) => {
    const ukedag = dayjs(periode.from).isoWeekday();
    const dagerIPeriodenDetErSøktFor = getDagInfoForPeriode(periode);
    const dager = dagerIPeriodenDetErSøktFor.filter((dag) => getISOWeekdayFromISODate(dag.isoDateString) === ukedag);
    return dager.filter((dag, index) => {
        return nthItemFilter(index, interval);
    });
};

export const getDagerSomSkalEndresFraEnkeltdagEndring = (
    { dato, gjelderFlereDager }: ArbeidstidEnkeltdagEndring,
    endringsperiode: DateRange
): ISODate[] => {
    if (gjelderFlereDager) {
        let dagerSomSkalEndres: Daginfo[] = [];
        const periode: DateRange = {
            from: dato,
            to: gjelderFlereDager.tom || endringsperiode.to,
        };
        if (gjelderFlereDager.gjentagelsetype === GjentagelseType.hverUke) {
            dagerSomSkalEndres = getDagerMedInterval(1, periode);
        }
        if (gjelderFlereDager.gjentagelsetype === GjentagelseType.hverAndreUke) {
            dagerSomSkalEndres = getDagerMedInterval(2, periode);
        }
        if (gjelderFlereDager.gjentagelsetype === GjentagelseType.heleUken) {
            dagerSomSkalEndres = getDagInfoForPeriode(getWeekDateRange(periode.from));
        }
        if (gjelderFlereDager.gjentagelsetype === GjentagelseType.heleMåneden) {
            dagerSomSkalEndres = getDagInfoForPeriode(getMonthDateRange(periode.from));
        }
        return dagerSomSkalEndres.map((dag) => dag.isoDateString);
    }
    return [dateToISODate(dato)];
};
