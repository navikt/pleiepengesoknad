import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ISODateToDate } from '@navikt/sif-common-utils';
import { TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeFormData } from '../../../../types/ArbeidIPeriodeFormData';
import { cleanupArbeidIPeriode } from '../cleanupArbeidstidStep';

const periodeFromDateString = '2021-02-01';
const periodeToDateString = '2021-02-12';

const arbeidIPeriode: ArbeidIPeriodeFormData = {
    jobberIPerioden: YesOrNo.YES,
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

describe('cleanupArbeidstidAnsatt', () => {
    it('Fjerner informasjon dersom en ikke jobber i perioden ', () => {
        const result = cleanupArbeidIPeriode({ ...arbeidIPeriode, jobberIPerioden: YesOrNo.NO }, periode);
        expect(result.jobberIPerioden).toEqual(YesOrNo.NO);
        expect(Object.keys(result).length).toBe(1);
    });
    it('Beholder riktig informasjon når en jobber likt en prosent i perioden', () => {
        const result = cleanupArbeidIPeriode(
            {
                ...arbeidIPeriode,
                timerEllerProsent: TimerEllerProsent.PROSENT,
            },
            periode
        );
        expect(result.jobberIPerioden).toEqual(YesOrNo.YES);
        expect(result.erLiktHverUke).toEqual(YesOrNo.YES);
        expect(result.timerEllerProsent).toEqual(TimerEllerProsent.PROSENT);
        expect(result.jobberProsent).toEqual('20');
        expect(result.enkeltdager).toBeUndefined();
        expect(result.enkeltdager).toBeUndefined();
    });
    it('Beholder riktig informasjon når en jobber likt i perioden og oppgir timer en eksempeluke', () => {
        const result = cleanupArbeidIPeriode(
            {
                ...arbeidIPeriode,
                timerEllerProsent: TimerEllerProsent.TIMER,
            },
            periode
        );
        expect(result.jobberIPerioden).toEqual(YesOrNo.YES);
        expect(result.erLiktHverUke).toEqual(YesOrNo.YES);
        expect(result.timerEllerProsent).toEqual(TimerEllerProsent.TIMER);
        expect(result.jobberProsent).toBeUndefined();
        expect(result.enkeltdager).toBeUndefined();
        expect(result.fasteDager).toBeDefined();
        expect(result.fasteDager?.friday?.hours).toEqual('2');
        expect(result.fasteDager?.friday?.minutes).toEqual('10');
    });
});
