import { getNumberFromNumberInputValue, InputTime } from '@navikt/sif-common-formik/lib';
import { ArbeidstidPeriodeData } from '@navikt/sif-common-pleiepenger';
import {
    DateDurationMap,
    dateToISODate,
    decimalDurationToDuration,
    durationToDecimalDuration,
    DurationWeekdays,
    getDatesInDateRange,
    getDurationForISOWeekdayNumber,
    ISODateToDate,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const getRedusertArbeidstidSomDuration = (
    jobberNormaltTimerPerDagNumber: number,
    skalJobbeProsent: number
): InputTime => {
    const redusertTidPerDag = (jobberNormaltTimerPerDagNumber / 100) * skalJobbeProsent;
    return decimalDurationToDuration(redusertTidPerDag);
};

export const getDagerMedTidFraArbeidstidPeriodeData = (
    { fom, tom, prosent, tidFasteDager }: ArbeidstidPeriodeData,
    tid: {
        timerSnittPerUke?: number;
        timerFasteUkedager?: DurationWeekdays;
    }
): DateDurationMap => {
    const datoerIPeriode = getDatesInDateRange({ from: fom, to: tom }, true);
    const dagerMedTid: DateDurationMap = {};
    datoerIPeriode.forEach((dato) => {
        const isoDate = dateToISODate(dato);
        if (prosent !== undefined) {
            const prosentNumber = getNumberFromNumberInputValue(prosent);
            if (prosentNumber === undefined) {
                return;
            }
            if (prosentNumber === 0) {
                dagerMedTid[isoDate] = { hours: '0', minutes: '0', percentage: prosentNumber };
            } else {
                if (tid.timerSnittPerUke) {
                    const isoDurationPerDag = getRedusertArbeidstidSomDuration(tid.timerSnittPerUke / 5, prosentNumber);
                    dagerMedTid[isoDate] = { ...isoDurationPerDag, percentage: prosentNumber };
                } else if (tid.timerFasteUkedager) {
                    const fastArbeidstidDenneDagen = getDurationForISOWeekdayNumber(
                        tid.timerFasteUkedager,
                        dayjs(dato).isoWeekday()
                    );
                    if (fastArbeidstidDenneDagen) {
                        const isoDurationPerDag = getRedusertArbeidstidSomDuration(
                            durationToDecimalDuration(fastArbeidstidDenneDagen),
                            prosentNumber
                        );
                        dagerMedTid[isoDate] = { ...isoDurationPerDag, percentage: prosentNumber };
                    } else {
                        dagerMedTid[isoDate] = { hours: '0', minutes: '0' };
                    }
                }
            }
        } else if (tidFasteDager) {
            const varighet = getDurationForISOWeekdayNumber(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
            if (varighet) {
                dagerMedTid[isoDate] = { ...varighet };
            }
        }
    });
    return dagerMedTid;
};
