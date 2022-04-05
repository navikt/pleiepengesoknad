import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormData, ArbeiderIPeriodenSvar } from '../../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeType } from '../../../types/Søknadsdata';
import { extractArbeidIPeriodeSøknadsdata } from '../extractArbeidIPeriodeSøknadsdata';

const søknadsperiode = ISODateRangeToDateRange('2022-01-01/2022-02-01');

// const arbeidIPeriode: ArbeidIPeriodeFormData = {
//     arbeiderIPerioden: undefined,
//     prosentAvNormalt: '50',
//     erLiktHverUke: YesOrNo.YES,
//     timerEllerProsent: TimerEllerProsent.PROSENT,
// };

const arbeiderIkke: ArbeidIPeriodeFormData = {
    arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær,
};

const arbeiderVanlig: ArbeidIPeriodeFormData = {
    arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
};

const arbeidProsentAvNormalt: ArbeidIPeriodeFormData = {
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
    erLiktHverUke: YesOrNo.YES,
    timerEllerProsent: TimerEllerProsent.PROSENT,
    prosentAvNormalt: '50',
};

const arbeidTimerISnitt: ArbeidIPeriodeFormData = {
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
    erLiktHverUke: YesOrNo.YES,
    timerEllerProsent: TimerEllerProsent.TIMER,
    timerPerUke: '20',
};

const arbeidVariert: ArbeidIPeriodeFormData = {
    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
    erLiktHverUke: YesOrNo.NO,
    enkeltdager: {
        '2022-01-03': {
            hours: '1',
            minutes: '30',
        },
    },
};

describe('extractArbeidIPeriodeSøknadsdata', () => {
    it('returnerer undefined dersom arbeidstid er lik hver uke, men tillegsdata mangler', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            { ...arbeidProsentAvNormalt, fasteDager: undefined, arbeiderIPerioden: undefined },

            søknadsperiode
        );
        expect(result).toBeUndefined();
    });
    // it.only('returnerer undefined dersom arbeidstid varierer, men enkeltdager mangler', () => {
    //     const result = extractArbeidIPeriodeSøknadsdata({ ...arbeidVariert, enkeltdager: undefined }, søknadsperiode);
    //     expect(result).toBeUndefined();
    // });
    // it('returnerer riktig når en ikke jobber i perioden', () => {
    //     const result = extractArbeidIPeriodeSøknadsdata(arbeiderIkke, søknadsperiode);
    //     expect(result).toBeDefined();
    //     expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderIkke);
    //     expect((result as any).arbeiderIPerioden).toBeFalsy();
    //     expect((result as any).fasteDager).toBeUndefined();
    //     expect((result as any).prosentAvNormalt).toBeUndefined();
    //     expect((result as any).enkeltdager).toBeUndefined();
    // });
    // it('returnerer riktig når en jobber som vanlig i perioden', () => {
    //     const result = extractArbeidIPeriodeSøknadsdata(arbeiderVanlig, søknadsperiode);
    //     expect(result).toBeDefined();
    //     expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderVanlig);
    //     expect((result as any).arbeiderIPerioden).toBeTruthy();
    //     expect((result as any).arbeiderRedusert).toBeFalsy();
    //     expect((result as any).fasteDager).toBeUndefined();
    //     expect((result as any).prosentAvNormalt).toBeUndefined();
    //     expect((result as any).enkeltdager).toBeUndefined();
    // });
    // it('returnerer riktig for når arbeid er oppgitt i prosent', () => {
    //     const result = extractArbeidIPeriodeSøknadsdata(arbeidProsentAvNormalt, søknadsperiode);
    //     expect(result).toBeDefined();
    //     expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderProsentAvNormalt);
    //     if (result?.type === ArbeidIPeriodeType.arbeiderProsentAvNormalt) {
    //         expect(result.arbeiderIPerioden).toBeTruthy();
    //         expect(result.arbeiderRedusert).toBeTruthy();
    //         expect(result.prosentAvNormalt).toEqual(50);
    //         expect((result as any).fasteDager).toBeUndefined();
    //         expect((result as any).enkeltdager).toBeUndefined();
    //     }
    // });
    // it('returnerer riktig for like uker og arbeid oppgitt i faste dager', () => {
    //     const result = extractArbeidIPeriodeSøknadsdata(arbeidTimerISnitt, søknadsperiode);
    //     expect(result).toBeDefined();
    //     expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderFasteUkedager);
    //     if (result?.type === ArbeidIPeriodeType.arbeiderFasteUkedager) {
    //         expect(result.arbeiderIPerioden).toBeTruthy();
    //         expect(result.arbeiderRedusert).toBeTruthy();
    //         expect(result.fasteDager).toBeDefined();
    //         expect((result as any).prosentAvNormalt).toBeUndefined();
    //         expect((result as any).fasteDager).toBeUndefined();
    //         expect((result as any).enkeltdager).toBeUndefined();
    //     }
    // });
    // it('returnerer riktig når det varierer/enkeltdager', () => {
    //     const result = extractArbeidIPeriodeSøknadsdata(arbeidVariert, søknadsperiode);
    //     expect(result).toBeDefined();
    //     expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderEnkeltdager);
    //     if (result?.type === ArbeidIPeriodeType.arbeiderEnkeltdager) {
    //         expect(result.arbeiderIPerioden).toBeTruthy();
    //         expect(result.arbeiderRedusert).toBeTruthy();
    //         expect(result.enkeltdager).toBeDefined();
    //         expect((result as any).fasteDager).toBeUndefined();
    //         expect((result as any).prosentAvNormalt).toBeUndefined();
    //     }
    // });
});
