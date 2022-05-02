import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { NormalarbeidstidType } from '../../../types/søknadsdata/Søknadsdata';
import { extractNormalarbeidstid } from '../extractNormalarbeidstidSøknadsdata';

describe('extractNormalarbeidstid', () => {
    describe('ArbeidsforholdType.ANSATT: false', () => {
        it('returnerer undefined dersom normalarbeidstid === undefined', () => {
            expect(extractNormalarbeidstid(undefined, ArbeidsforholdType.ANSATT)).toBeUndefined();
        });
        it('returnerer undefined dersom erLiktHverUke === undefined', () => {
            expect(
                extractNormalarbeidstid(
                    {
                        erLikeMangeTimerHverUke: undefined,
                        timerFasteUkedager: undefined,
                        timerPerUke: undefined,
                    },
                    ArbeidsforholdType.ANSATT
                )
            ).toBeUndefined();
        });
        it('returnerer undefined dersom erLiktHverUke === false && timerPerUke er ugyldig', () => {
            const result = extractNormalarbeidstid(
                {
                    erLikeMangeTimerHverUke: YesOrNo.NO,
                    erFasteUkedager: YesOrNo.YES,
                    timerPerUke: 'abc',
                },
                ArbeidsforholdType.ANSATT
            );
            expect(result).toBeUndefined();
        });

        it('returnerer likeUkerOgDager dersom erLiktHverUke === true og jobberFasteUkedager === true', () => {
            const result = extractNormalarbeidstid(
                {
                    erLikeMangeTimerHverUke: YesOrNo.YES,
                    erFasteUkedager: YesOrNo.YES,
                    timerFasteUkedager: { monday: { hours: '1', minutes: '30' } },
                },
                ArbeidsforholdType.ANSATT
            );
            expect(result).toBeDefined();
            expect(result?.type).toEqual(NormalarbeidstidType.likeUkerOgDager);
            expect(result?.erLiktHverUke).toBeTruthy();
            if (result?.type === NormalarbeidstidType.likeUkerOgDager) {
                expect(result?.timerFasteUkedager.monday?.hours).toEqual('1');
                expect(result?.timerFasteUkedager.monday?.minutes).toEqual('30');
                expect((result as any).timerPerUke).toBeUndefined();
            }
        });
        it('returnerer timerPerUke og dersom erLiktHverUke === false', () => {
            const result = extractNormalarbeidstid(
                {
                    erLikeMangeTimerHverUke: YesOrNo.NO,
                    erFasteUkedager: YesOrNo.NO,
                    timerFasteUkedager: {},
                    timerPerUke: '30',
                },
                ArbeidsforholdType.ANSATT
            );
            expect(result).toBeDefined();
            expect(result?.type).toEqual(NormalarbeidstidType.varierendeUker);
            expect(result?.erLiktHverUke).toBeFalsy();
            if (result?.type === NormalarbeidstidType.varierendeUker) {
                expect(result?.timerPerUkeISnitt).toEqual(30);
                expect((result as any).timerFasteUkedager).toBeUndefined();
            }
        });
    });
    describe('Frilanser/SN', () => {
        it('returnerer undefined dersom normalarbeidstid === undefined', () => {
            expect(extractNormalarbeidstid(undefined, ArbeidsforholdType.FRILANSER)).toBeUndefined();
        });
        it('returnerer riktig for Frilanser', () => {
            const result = extractNormalarbeidstid(
                {
                    timerPerUke: '12',
                },
                ArbeidsforholdType.FRILANSER
            );
            expect(result).toBeDefined();
            expect(result?.type).toEqual(NormalarbeidstidType.varierendeUker);
            if (result?.type === NormalarbeidstidType.varierendeUker) {
                expect(Object.keys(result).length).toBe(4);
                expect(result?.timerPerUkeISnitt).toEqual(12);
                expect(result?.erFasteUkedager).toBeFalsy();
                expect(result?.erLiktHverUke).toBeFalsy();
            }
        });
        it('returnerer riktig for SN', () => {
            const result = extractNormalarbeidstid(
                {
                    timerPerUke: '12',
                },
                ArbeidsforholdType.SELVSTENDIG
            );
            expect(result).toBeDefined();
            expect(result?.type).toEqual(NormalarbeidstidType.varierendeUker);
            if (result?.type === NormalarbeidstidType.varierendeUker) {
                expect(Object.keys(result).length).toBe(4);
                expect(result?.timerPerUkeISnitt).toEqual(12);
                expect(result?.erFasteUkedager).toBeFalsy();
                expect(result?.erLiktHverUke).toBeFalsy();
            }
        });
    });
});
