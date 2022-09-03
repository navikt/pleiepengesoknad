/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeType } from '../../../types/arbeidIPeriodeType';
import { ArbeidIPeriodeApiData } from '../../../types/søknad-api-data/arbeidIPeriodeApiData';
import {
    mapArbeidIPeriodeApiDataProsentToFormValues,
    mapArbeidIPeriodeApiDataTimerPerUkeToFormValues,
    mapArbeidIPeriodeApiDataToFormValues,
} from '../mapArbeidIPeriodeToFormValues';

describe('mapArbeidIPeriodeApiDataToFormValues', () => {
    it('returnerer riktig når en ikke arbeider i perioden', () => {
        const arbeid: ArbeidIPeriodeApiData = {
            type: ArbeidIPeriodeType.arbeiderIkke,
            arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær,
        };
        expect(mapArbeidIPeriodeApiDataToFormValues(arbeid)!.arbeiderIPerioden).toEqual(
            ArbeiderIPeriodenSvar.heltFravær
        );
    });
    it('returnerer riktig når en jobber som vanlig i perioden', () => {
        const arbeid: ArbeidIPeriodeApiData = {
            type: ArbeidIPeriodeType.arbeiderVanlig,
            arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
        };
        expect(mapArbeidIPeriodeApiDataToFormValues(arbeid)!.arbeiderIPerioden).toEqual(
            ArbeiderIPeriodenSvar.somVanlig
        );
    });
    describe('arbeid timer i snitt', () => {
        it('returnerer riktig når en arbeider timer i snitt', () => {
            const arbeid: ArbeidIPeriodeApiData = {
                type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                timerPerUke: 'PT20H30M',
            };
            const { timerEllerProsent, timerPerUke, arbeiderIPerioden } =
                mapArbeidIPeriodeApiDataTimerPerUkeToFormValues(arbeid);
            expect(arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.redusert);
            expect(timerEllerProsent).toEqual(TimerEllerProsent.TIMER);
            expect(timerPerUke).toEqual('20,5');
        });
    });
    describe('arbeid prosent av vanlig', () => {
        it('returnerer riktig når en arbeider prosent av vanlig', () => {
            const arbeid: ArbeidIPeriodeApiData = {
                type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                prosentAvNormalt: 15,
            };
            const { timerEllerProsent, prosentAvNormalt, arbeiderIPerioden } =
                mapArbeidIPeriodeApiDataProsentToFormValues(arbeid);
            expect(arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.redusert);
            expect(timerEllerProsent).toEqual(TimerEllerProsent.PROSENT);
            expect(prosentAvNormalt).toEqual('15');
        });
    });
    describe('arbeider enkeltdager', () => {
        const arbeid: ArbeidIPeriodeApiData = {
            type: ArbeidIPeriodeType.arbeiderEnkeltdager,
            arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
            enkeltdager: [{ dato: '2022-01-01', arbeidstimer: { faktiskTimer: 'PT2H30M', normalTimer: 'PT4H0M' } }],
        };
        it('returnerer riktig når en jobber redusert enkeltdager', () => {
            const result = mapArbeidIPeriodeApiDataToFormValues(arbeid);
            const { arbeiderIPerioden, enkeltdager, erLiktHverUke } = result!;
            expect(arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.redusert);
            expect(erLiktHverUke).toEqual(YesOrNo.NO);
            expect(enkeltdager).toBeDefined();
            const enkeltdag = enkeltdager!['2022-01-01'];
            expect(enkeltdag).toBeDefined();
            expect(enkeltdag.hours).toEqual('2');
            expect(enkeltdag.minutes).toEqual('30');
        });
    });
});
