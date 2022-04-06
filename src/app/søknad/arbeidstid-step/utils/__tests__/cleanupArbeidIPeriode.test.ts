import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ISODateToDate } from '@navikt/sif-common-utils';
import { TimerEllerProsent } from '../../../../types';
import { ArbeiderIPeriodenSvar, ArbeidIPeriodeFormData } from '../../../../types/ArbeidIPeriodeFormData';
import { NormalarbeidstidFormData } from '../../../../types/ArbeidsforholdFormData';
import { cleanupArbeidIPeriode } from '../cleanupArbeidstidStep';

const periodeFromDateString = '2021-02-01';
const periodeToDateString = '2021-02-12';

const arbeidIPeriode: ArbeidIPeriodeFormData = {
    arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
    erLiktHverUke: YesOrNo.YES,
    timerEllerProsent: TimerEllerProsent.PROSENT,
    fasteDager: {
        friday: { minutes: '10', hours: '2' },
    },
    enkeltdager: { '2021-02-01': { hours: '2', minutes: '0', percentage: 20 } },
    prosentAvNormalt: '20',
};

const periode: DateRange = {
    from: ISODateToDate(periodeFromDateString),
    to: ISODateToDate(periodeToDateString),
};

const normalarbeidstid: NormalarbeidstidFormData = {
    erLikeMangeTimerHverUke: YesOrNo.YES,
    erFasteUkedager: YesOrNo.NO,
    timerPerUke: '20',
};

describe('cleanupArbeidIPeriode', () => {
    it('Fjerner informasjon dersom en ikke jobber i perioden ', () => {
        const result = cleanupArbeidIPeriode(
            { ...arbeidIPeriode, arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær },
            normalarbeidstid,
            periode
        );
        expect(result.arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.heltFravær);
        expect(Object.keys(result).length).toBe(1);
    });
    it('Fjerner informasjon dersom en jobber som vanlig i perioden ', () => {
        const result = cleanupArbeidIPeriode(
            { ...arbeidIPeriode, arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig },
            normalarbeidstid,
            periode
        );
        expect(result.arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.somVanlig);
        expect(Object.keys(result).length).toBe(1);
    });
    // describe('jobber redusert', () => {
    //     it('Beholder riktig informasjon når en prosent av normalt', () => {
    //         const result = cleanupArbeidIPeriode(
    //             {
    //                 ...arbeidIPeriode,
    //                 timerEllerProsent: TimerEllerProsent.PROSENT,
    //             },
    //             periode
    //         );
    //         expect(result.arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.redusert);
    //         expect(result.erLiktHverUke).toEqual(YesOrNo.YES);
    //         expect(result.timerEllerProsent).toEqual(TimerEllerProsent.PROSENT);
    //         expect(result.prosentAvNormalt).toEqual('20');
    //         expect(result.enkeltdager).toBeUndefined();
    //         expect(result.enkeltdager).toBeUndefined();
    //     });
    //     it('Beholder riktig informasjon når en jobber timer i snitt per uke', () => {
    //         const result = cleanupArbeidIPeriode(
    //             {
    //                 ...arbeidIPeriode,
    //                 timerEllerProsent: TimerEllerProsent.TIMER,
    //             },
    //             periode
    //         );
    //         expect(result.arbeiderIPerioden).toEqual(YesOrNo.YES);
    //         expect(result.erLiktHverUke).toEqual(YesOrNo.YES);
    //         expect(result.timerEllerProsent).toEqual(TimerEllerProsent.TIMER);
    //         expect(result.prosentAvNormalt).toBeUndefined();
    //         expect(result.timerPerUke).toBeUndefined();
    //         expect(result.enkeltdager).toBeUndefined();
    //         expect(result.fasteDager).toBeDefined();
    //         expect(result.fasteDager?.friday?.hours).toEqual('2');
    //         expect(result.fasteDager?.friday?.minutes).toEqual('10');
    //     });
    //     it('Beholder riktig informasjon når en jobber variert og enkeltdager', () => {
    //         const result = cleanupArbeidIPeriode(
    //             {
    //                 ...arbeidIPeriode,
    //                 timerEllerProsent: TimerEllerProsent.TIMER,
    //             },
    //             periode
    //         );
    //         expect(result.arbeiderIPerioden).toEqual(YesOrNo.YES);
    //         expect(result.erLiktHverUke).toEqual(YesOrNo.YES);
    //         expect(result.timerEllerProsent).toEqual(TimerEllerProsent.TIMER);
    //         expect(result.prosentAvNormalt).toBeUndefined();
    //         expect(result.timerPerUke).toBeUndefined();
    //         expect(result.enkeltdager).toBeUndefined();
    //         expect(result.fasteDager).toBeDefined();
    //         expect(result.fasteDager?.friday?.hours).toEqual('2');
    //         expect(result.fasteDager?.friday?.minutes).toEqual('10');
    //     });
    //     it('Beholder riktig informasjon når en jobber faste ukedager', () => {
    //         const result = cleanupArbeidIPeriode(
    //             {
    //                 ...arbeidIPeriode,
    //                 timerEllerProsent: TimerEllerProsent.TIMER,
    //             },
    //             periode
    //         );
    //         expect(result.arbeiderIPerioden).toEqual(YesOrNo.YES);
    //         expect(result.erLiktHverUke).toEqual(YesOrNo.YES);
    //         expect(result.timerEllerProsent).toEqual(TimerEllerProsent.TIMER);
    //         expect(result.prosentAvNormalt).toBeUndefined();
    //         expect(result.timerPerUke).toBeUndefined();
    //         expect(result.enkeltdager).toBeUndefined();
    //         expect(result.fasteDager).toBeDefined();
    //         expect(result.fasteDager?.friday?.hours).toEqual('2');
    //         expect(result.fasteDager?.friday?.minutes).toEqual('10');
    //     });
    // });
});
