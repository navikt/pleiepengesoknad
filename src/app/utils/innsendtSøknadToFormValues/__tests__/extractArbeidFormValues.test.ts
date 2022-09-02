/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { durationToISODuration } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeType } from '../../../types/arbeidIPeriodeType';
import { ArbeidsgiverApiData } from '../../../types/søknad-api-data/arbeidsgiverApiData';
import { ArbeidIPeriodeApiData, TimerFasteDagerApiData } from '../../../types/søknad-api-data/SøknadApiData';
import {
    arbeidsgiverHarOrganisasjonsnummer,
    mapArbeidIPeriodeApiDataTimerPerUkeToFormValues,
    mapArbeidIPeriodeApiDataToFormValues,
    mapNormalarbeidstidApiDataToFormValues,
    timerFasteDagerApiDataToDurationWeekdays,
} from '../extractArbeidFormValues';

describe('arbeidFormValues', () => {
    describe('arbeidsgiverHarOrganisasjonsnummer', () => {
        it('returnerer true når det er et org-nummer', () => {
            expect(
                arbeidsgiverHarOrganisasjonsnummer({ organisasjonsnummer: '234' } as ArbeidsgiverApiData)
            ).toBeTruthy();
        });
        it('returnerer false når det ikke er ett org-nummer', () => {
            expect(arbeidsgiverHarOrganisasjonsnummer({} as ArbeidsgiverApiData)).toBeFalsy();
        });
    });

    describe('timerFasteDagerApiDataToDurationWeekdays', () => {
        const timer: TimerFasteDagerApiData = {
            mandag: 'PT1H0M',
            tirsdag: 'PT2H0M',
            onsdag: 'PT3H30M',
            torsdag: 'PT4H0M',
            fredag: 'PT5H0M',
        };
        it('returnerer riktig for uke mer timer hver dag', () => {
            const result = timerFasteDagerApiDataToDurationWeekdays(timer);
            expect(durationToISODuration(result.monday!)).toEqual('PT1H0M');
            expect(durationToISODuration(result.tuesday!)).toEqual('PT2H0M');
            expect(durationToISODuration(result.wednesday!)).toEqual('PT3H30M');
            expect(durationToISODuration(result.thursday!)).toEqual('PT4H0M');
            expect(durationToISODuration(result.friday!)).toEqual('PT5H0M');
        });
        it('returnerer riktig for tom uke', () => {
            const result = timerFasteDagerApiDataToDurationWeekdays({});
            expect(result.monday).toBeUndefined();
            expect(result.tuesday).toBeUndefined();
            expect(result.wednesday).toBeUndefined();
            expect(result.thursday).toBeUndefined();
            expect(result.friday).toBeUndefined();
        });
    });

    describe('mapNormalarbeidstidApiDataToNormalarbeidstidFormData', () => {
        it('returnerer riktig for normalarbeidstid med snitt', () => {
            const result = mapNormalarbeidstidApiDataToFormValues({
                erLiktHverUke: true,
                timerFasteDager: {
                    mandag: 'PT1H0M',
                },
                _arbeiderDeltid: false,
                _arbeiderHelg: false,
            });
            expect(result).toBeDefined();
            expect(result?.erLikeMangeTimerHverUke).toEqual(YesOrNo.YES);
            expect(result?.timerFasteUkedager).toBeDefined();
        });
        it('returnerer riktig for normalarbeidstid med snitt', () => {
            const result = mapNormalarbeidstidApiDataToFormValues({
                erLiktHverUke: false,
                timerPerUkeISnitt: 'PT20H30M',
            });
            expect(result).toBeDefined();
            expect(result?.timerPerUke).toEqual('20,5');
            expect(result?.erLikeMangeTimerHverUke).toEqual(YesOrNo.NO);
        });
    });

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
                expect(timerEllerProsent).toEqual(TimerEllerProsent.TIMER);
                expect(arbeiderIPerioden).toEqual(ArbeiderIPeriodenSvar.redusert);
                expect(timerPerUke).toEqual('20,5');
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
});
