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

const arbeidsukerProsent: ArbeidsukerProsentSøknadsdata = {
    '2020_1': {
        prosentAvNormalt: 20,
    },
    '2020_2': {
        prosentAvNormalt: 30,
    },
    '2020_3': {
        prosentAvNormalt: 40.5,
    },
};

const arbeidsukerTimer: ArbeidsukerTimerSøknadsdata = {
    '2020_1': {
        timer: 5,
    },
    '2020_2': {
        timer: 6,
    },
    '2020_3': {
        timer: 6.2,
    },
};

describe('getArbeidsforholdApiDataFromSøknadsdata', () => {
    describe('getArbeidsukerTimerApiData', () => {
        const result = getArbeidsukerTimerApiData(arbeidsukerTimer);
        it('mapper om timer riktig til ISODuration', () => {
            expect(result['2020_1']).toBeDefined();
            expect(result['2020_1']).toEqual({ timer: 'PT5H0M' });
        });
        it('mapper om timer riktig til ISODuration', () => {
            expect(result['2020_2']).toBeDefined();
            expect(result['2020_2']).toEqual({ timer: 'PT6H0M' });
        });
        it('mapper om timer riktig til ISODuration', () => {
            expect(result['2020_3']).toBeDefined();
            expect(result['2020_3']).toEqual({ timer: 'PT6H12M' });
        });
    });

    describe('getArbeidsukerProsentApiData', () => {
        const result = getArbeidsukerProsentApiData(arbeidsukerProsent);
        it('mapper om prosent riktig', () => {
            expect(result['2020_1']).toBeDefined();
            expect(result['2020_1']).toEqual({ prosentAvNormalt: 20 });
        });
        it('mapper om prosent riktig', () => {
            expect(result['2020_2']).toBeDefined();
            expect(result['2020_2']).toEqual({ prosentAvNormalt: 30 });
        });
        it('mapper om prosent riktig', () => {
            expect(result['2020_3']).toBeDefined();
            expect(result['2020_3']).toEqual({ prosentAvNormalt: 40.5 });
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
                snittTimerPerUke: 'PT20H0M',
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
                arbeidsuker: arbeidsukerProsent,
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
                arbeidsuker: {
                    '2020_1': { timer: 'PT5H0M' },
                    '2020_2': { timer: 'PT6H0M' },
                    '2020_3': { timer: 'PT6H12M' },
                },
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
