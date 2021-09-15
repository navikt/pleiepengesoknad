import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Time } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { OmsorgstilbudDag } from './types';

dayjs.extend(isBetween);

export const getOmsorgsdagerIPeriode = (omsorgsdager: OmsorgstilbudDag[], periode: DateRange): OmsorgstilbudDag[] =>
    omsorgsdager.filter((dag) => dag && dayjs(dag.dato).isBetween(periode.from, periode.to, 'day', '[]'));

export const summerTid = (omsorgsdager: OmsorgstilbudDag[]): Time => {
    let timer = 0;
    let minutter = 0;
    omsorgsdager.forEach(({ tid: { hours = '0', minutes = '0' } }) => {
        if (hours && parseInt(hours, 10) >= 0) {
            timer += parseInt(hours, 10) || 0;
        }
        if (hours && parseInt(minutes, 10) >= 0) {
            minutter += parseInt(minutes, 10) || 0;
        }
    });
    const heleTimerIMinutter = Math.floor(minutter / 60);
    if (heleTimerIMinutter > 0) {
        timer += heleTimerIMinutter;
        minutter -= heleTimerIMinutter * 60;
    }
    return {
        hours: `${timer}`,
        minutes: `${minutter}`,
    };
};
