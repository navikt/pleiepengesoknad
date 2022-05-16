import { ArbeiderIPeriodenSvar, ArbeidstidPeriodeData } from '@navikt/sif-common-pleiepenger';
import {
    DateDurationMap,
    dateToISODate,
    Duration,
    DurationWeekdays,
    getDatesInDateRange,
    getDurationForISOWeekdayNumber,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const noDuration: Duration = { hours: '0', minutes: '0' };

const getDurationOrNoDurationForISOWeekdayNumber = (date: Date, durationWeekdays: DurationWeekdays = {}): Duration => {
    return getDurationForISOWeekdayNumber(durationWeekdays, dayjs(date).isoWeekday()) || noDuration;
};

export const getDagerMedTidFraArbeidstidPeriodeData = (
    data: ArbeidstidPeriodeData,
    tid: {
        timerSnittPerUke?: number;
        timerFasteUkedager?: DurationWeekdays;
    }
): DateDurationMap => {
    const datoerIPeriode = getDatesInDateRange({ from: data.fom, to: data.tom }, true);
    const dagerMedTid: DateDurationMap = {};
    datoerIPeriode.forEach((dato) => {
        const isoDate = dateToISODate(dato);
        switch (data.arbeiderHvordan) {
            case ArbeiderIPeriodenSvar.heltFravær:
                dagerMedTid[isoDate] = noDuration;
                break;
            case ArbeiderIPeriodenSvar.somVanlig:
                dagerMedTid[isoDate] = getDurationOrNoDurationForISOWeekdayNumber(dato, tid.timerFasteUkedager);
                break;
            case ArbeiderIPeriodenSvar.redusert:
                dagerMedTid[isoDate] = getDurationOrNoDurationForISOWeekdayNumber(dato, data.tidFasteDager);
                break;
        }
    });
    return dagerMedTid;
};
