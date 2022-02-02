import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ISODateToDate } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { JobberIPeriodeSvar, TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriode } from '../../../../types/SøknadFormData';
import { cleanupArbeidIPeriode } from '../cleanupArbeidIPeriodeStep';

dayjs.extend(minMax);

const periodeFromDateString = '2021-02-01';
const periodeToDateString = '2021-02-12';

const arbeidIPeriode: ArbeidIPeriode = {
    jobberIPerioden: JobberIPeriodeSvar.JA,
    erLiktHverUke: YesOrNo.YES,
    timerEllerProsent: TimerEllerProsent.PROSENT,
    fasteDager: {
        friday: { minutes: '10', hours: '2' },
    },
    enkeltdager: { '2021-02-01': { hours: '2', minutes: '0', percentage: 20 } },
    jobberProsent: '20',
};

const periode: DateRange = {
    from: ISODateToDate(periodeFromDateString),
    to: ISODateToDate(periodeToDateString),
};

describe('cleanupArbeidIPeriode', () => {
    it('Fjerner informasjon dersom en ikke jobber i perioden ', () => {
        const result = cleanupArbeidIPeriode(periode, { ...arbeidIPeriode, jobberIPerioden: JobberIPeriodeSvar.NEI });
        expect(result.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
        expect(Object.keys(result).length).toBe(1);
    });
    it('Beholder riktig informasjon når en jobber likt en prosent i perioden', () => {
        const result = cleanupArbeidIPeriode(periode, {
            ...arbeidIPeriode,
            timerEllerProsent: TimerEllerProsent.PROSENT,
        });
        expect(result.jobberIPerioden).toEqual(JobberIPeriodeSvar.JA);
        expect(result.erLiktHverUke).toEqual(YesOrNo.YES);
        expect(result.timerEllerProsent).toEqual(TimerEllerProsent.PROSENT);
        expect(result.jobberProsent).toEqual('20');
        expect(result.enkeltdager).toBeUndefined();
        expect(result.enkeltdager).toBeUndefined();
    });
    it('Beholder riktig informasjon når en jobber likt i perioden og oppgir timer en eksempeluke', () => {
        const result = cleanupArbeidIPeriode(periode, {
            ...arbeidIPeriode,
            timerEllerProsent: TimerEllerProsent.TIMER,
        });
        expect(result.jobberIPerioden).toEqual(JobberIPeriodeSvar.JA);
        expect(result.erLiktHverUke).toEqual(YesOrNo.YES);
        expect(result.timerEllerProsent).toEqual(TimerEllerProsent.TIMER);
        expect(result.jobberProsent).toBeUndefined();
        expect(result.enkeltdager).toBeUndefined();
        expect(result.fasteDager).toBeDefined();
        expect(result.fasteDager?.friday?.hours).toEqual('2');
        expect(result.fasteDager?.friday?.minutes).toEqual('10');
    });
});
