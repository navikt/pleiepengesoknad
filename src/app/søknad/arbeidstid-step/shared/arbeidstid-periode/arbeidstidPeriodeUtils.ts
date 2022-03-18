import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidstidPeriodeData, getRedusertArbeidstidSomDuration } from '@navikt/sif-common-pleiepenger/lib';
import {
    DateDurationMap,
    dateToISODate,
    getDatesInDateRange,
    getDurationForISOWeekday,
    ISODateToDate,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export const getDagerMedTidFraArbeidstidPeriodeData = (
    normalTimer: number,
    { fom, tom, prosent, tidFasteDager }: ArbeidstidPeriodeData
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
                const isoDurationPerDag = getRedusertArbeidstidSomDuration(normalTimer / 5, prosentNumber);
                dagerMedTid[isoDate] = { ...isoDurationPerDag, percentage: prosentNumber };
            }
        } else if (tidFasteDager) {
            const varighet = getDurationForISOWeekday(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
            if (varighet) {
                dagerMedTid[isoDate] = { ...varighet };
            }
        }
    });
    return dagerMedTid;
};
