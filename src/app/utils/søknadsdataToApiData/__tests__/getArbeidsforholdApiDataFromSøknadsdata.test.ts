import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidIPeriodeType } from '../../../types/arbeidIPeriodeType';
import {
    ArbeidIPeriodeApiDataJobberIkke,
    ArbeidIPeriodeApiDataJobberVanlig,
    ArbeidIPeriodeApiDataProsent,
    ArbeidIPeriodeApiDataTimerPerUke,
    ArbeidIPeriodeApiDataUlikeUkerProsent,
    ArbeidIPeriodeApiDataUlikeUkerTimer,
} from '../../../types/søknad-api-data/arbeidIPeriodeApiData';
import {
    ArbeidsukerProsentSøknadsdata,
    ArbeidsukerTimerSøknadsdata,
} from '../../../types/søknadsdata/arbeidIPeriodeSøknadsdata';
import {
    getArbeidIPeriodeApiDataFromSøknadsdata,
    getArbeidsukerProsentApiData,
    getArbeidsukerTimerApiData,
} from '../getArbeidsforholdApiDataFromSøknadsdata';

const uke1 = '2022-01-03/2022-01-09';
const uke2 = '2022-01-10/2022-01-16';
const uke3 = '2022-01-17/2022-01-23';

const arbeidsukerProsent: ArbeidsukerProsentSøknadsdata = {
    [uke1]: {
        prosentAvNormalt: 20,
    },
    [uke2]: {
        prosentAvNormalt: 30,
    },
    [uke3]: {
        prosentAvNormalt: 40.5,
    },
};

const arbeidsukerTimer: ArbeidsukerTimerSøknadsdata = {
    [uke1]: {
        timer: 5,
    },
    [uke2]: {
        timer: 6,
    },
    [uke3]: {
        timer: 6.2,
    },
};

describe('getArbeidsforholdApiDataFromSøknadsdata', () => {
    describe('getArbeidsukerTimerApiData', () => {
        const result = getArbeidsukerTimerApiData(arbeidsukerTimer);

        it('mapper om timer riktig til ISODuration', () => {
            expect(result[0]).toBeDefined();
            expect(result[0]).toEqual({ periode: { from: '2022-01-03', to: '2022-01-09' }, timer: 'PT5H0M' });
        });
        it('mapper om timer riktig til ISODuration', () => {
            expect(result[1]).toBeDefined();
            expect(result[1]).toEqual({ periode: { from: '2022-01-10', to: '2022-01-16' }, timer: 'PT6H0M' });
        });
        it('mapper om timer riktig til ISODuration', () => {
            expect(result[2]).toBeDefined();
            expect(result[2]).toEqual({ periode: { from: '2022-01-17', to: '2022-01-23' }, timer: 'PT6H12M' });
        });
    });

    describe('getArbeidsukerProsentApiData', () => {
        const result = getArbeidsukerProsentApiData(arbeidsukerProsent);
        it('mapper om prosent riktig', () => {
            expect(result[0]).toBeDefined();
            expect(result[0]).toEqual({ periode: { from: '2022-01-03', to: '2022-01-09' }, prosentAvNormalt: 20 });
        });
        it('mapper om prosent riktig', () => {
            expect(result[1]).toBeDefined();
            expect(result[1]).toEqual({ periode: { from: '2022-01-10', to: '2022-01-16' }, prosentAvNormalt: 30 });
        });
        it('mapper om prosent riktig', () => {
            expect(result[2]).toBeDefined();
            expect(result[2]).toEqual({ periode: { from: '2022-01-17', to: '2022-01-23' }, prosentAvNormalt: 40.5 });
        });
    });

    describe('getArbeidIPeriodeApiDataFromSøknadsdata', () => {
        it(`mapper riktig for ArbeidIPeriodeType === ${ArbeidIPeriodeType.arbeiderIkke}`, () => {
            const result: ArbeidIPeriodeApiDataJobberIkke = {
                type: ArbeidIPeriodeType.arbeiderIkke,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær,
            };
            expect(
                getArbeidIPeriodeApiDataFromSøknadsdata({
                    type: ArbeidIPeriodeType.arbeiderIkke,
                    arbeiderIPerioden: false,
                })
            ).toEqual(result);
        });
        it(`mapper riktig for ArbeidIPeriodeType === ${ArbeidIPeriodeType.arbeiderVanlig}`, () => {
            const result: ArbeidIPeriodeApiDataJobberVanlig = {
                type: ArbeidIPeriodeType.arbeiderVanlig,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
            };
            expect(
                getArbeidIPeriodeApiDataFromSøknadsdata({
                    type: ArbeidIPeriodeType.arbeiderVanlig,
                    arbeiderIPerioden: true,
                    arbeiderRedusert: false,
                })
            ).toEqual(result);
        });
        it(`mapper riktig for ArbeidIPeriodeType === ${ArbeidIPeriodeType.arbeiderProsentAvNormalt}`, () => {
            const result: ArbeidIPeriodeApiDataProsent = {
                type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                prosentAvNormalt: 20,
            };
            expect(
                getArbeidIPeriodeApiDataFromSøknadsdata({
                    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                    arbeiderIPerioden: true,
                    arbeiderRedusert: true,
                    prosentAvNormalt: 20,
                })
            ).toEqual(result);
        });
        it(`mapper riktig for ArbeidIPeriodeType === ${ArbeidIPeriodeType.arbeiderTimerISnittPerUke}`, () => {
            const result: ArbeidIPeriodeApiDataTimerPerUke = {
                type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                timerPerUke: 'PT20H0M',
            };
            expect(
                getArbeidIPeriodeApiDataFromSøknadsdata({
                    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
                    arbeiderIPerioden: true,
                    arbeiderRedusert: true,
                    timerISnittPerUke: 20,
                })
            ).toEqual(result);
        });
        it(`mapper riktig for ArbeidIPeriodeType === ${ArbeidIPeriodeType.arbeiderUlikeUkerProsent}`, () => {
            const result: ArbeidIPeriodeApiDataUlikeUkerProsent = {
                type: ArbeidIPeriodeType.arbeiderUlikeUkerProsent,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                arbeidsuker: [
                    {
                        periode: {
                            from: '2022-01-03',
                            to: '2022-01-09',
                        },
                        prosentAvNormalt: 20,
                    },
                    {
                        periode: {
                            from: '2022-01-10',
                            to: '2022-01-16',
                        },
                        prosentAvNormalt: 30,
                    },
                    {
                        periode: {
                            from: '2022-01-17',
                            to: '2022-01-23',
                        },
                        prosentAvNormalt: 40.5,
                    },
                ],
            };
            expect(
                getArbeidIPeriodeApiDataFromSøknadsdata({
                    type: ArbeidIPeriodeType.arbeiderUlikeUkerProsent,
                    arbeiderIPerioden: true,
                    arbeiderRedusert: true,
                    arbeidsuker: arbeidsukerProsent,
                })
            ).toEqual(result);
        });
        it(`mapper riktig for ArbeidIPeriodeType === ${ArbeidIPeriodeType.arbeiderUlikeUkerTimer}`, () => {
            const result: ArbeidIPeriodeApiDataUlikeUkerTimer = {
                type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                arbeidsuker: [
                    {
                        periode: {
                            from: '2022-01-03',
                            to: '2022-01-09',
                        },
                        timer: 'PT5H0M',
                    },
                    {
                        periode: {
                            from: '2022-01-10',
                            to: '2022-01-16',
                        },
                        timer: 'PT6H0M',
                    },
                    {
                        periode: {
                            from: '2022-01-17',
                            to: '2022-01-23',
                        },
                        timer: 'PT6H12M',
                    },
                ],
            };
            expect(
                getArbeidIPeriodeApiDataFromSøknadsdata({
                    type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer,
                    arbeiderIPerioden: true,
                    arbeiderRedusert: true,
                    arbeidsuker: arbeidsukerTimer,
                })
            ).toEqual(result);
        });
    });
});
