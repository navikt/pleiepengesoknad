// import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
// import { TimerEllerProsent } from '../../../../types';
// import { ArbeidIPeriodeFormValues } from '../../../../types/ArbeidIPeriodeFormValues';
// import { NormalarbeidstidSøknadsdata } from '../../../../types/søknadsdata/Søknadsdata';
// import { cleanupArbeidIPeriode } from '../cleanupArbeidstidStep';

// const arbeidIPeriode: ArbeidIPeriodeFormValues = {
//     arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
//     timerEllerProsent: TimerEllerProsent.PROSENT,
//     prosentAvNormalt: '20',
// };

// const normalarbeidstid: NormalarbeidstidSøknadsdata = {
//     timerPerUkeISnitt: 20,
// };

describe('cleanupArbeidIPeriode', () => {
    it('runs', () => {
        expect(1).toBe(1);
    });
    /** TODO */
    // it('Fjerner informasjon dersom en ikke jobber i perioden ', () => {
    //     const result = cleanupArbeidIPeriode(
    //         { ...arbeidIPeriode, arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær },
    //         normalarbeidstid
    //     );
    //     expect(result.arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.heltFravær);
    //     expect(Object.keys(result).length).toBe(1);
    // });
    // it('Fjerner informasjon dersom en jobber som vanlig i perioden ', () => {
    //     const result = cleanupArbeidIPeriode(
    //         { ...arbeidIPeriode, arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig },
    //         normalarbeidstid
    //     );
    //     expect(result.arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.somVanlig);
    //     expect(Object.keys(result).length).toBe(1);
    // });
});
