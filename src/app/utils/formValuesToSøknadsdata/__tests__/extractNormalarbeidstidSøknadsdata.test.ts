import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { NormalarbeidstidType } from '../../../types/søknadsdata/Søknadsdata';
import { extractNormalarbeidstid } from '../extractNormalarbeidstidSøknadsdata';

describe('extractNormalarbeidstid', () => {
    it('returnerer undefined dersom normalarbeidstid === undefined', () => {
        expect(extractNormalarbeidstid(undefined)).toBeUndefined();
    });
    it('returnerer undefined dersom erLiktHverUke === undefined', () => {
        expect(
            extractNormalarbeidstid({
                erLikeMangeTimerHverUke: undefined,
                timerFasteUkedager: undefined,
                timerPerUke: undefined,
            })
        ).toBeUndefined();
    });
    it('returnerer undefined dersom erLiktHverUke === false && timerPerUke er ugyldig', () => {
        const result = extractNormalarbeidstid({
            erLikeMangeTimerHverUke: YesOrNo.NO,
            erFasteUkedager: YesOrNo.YES,
            timerPerUke: 'abc',
        });
        expect(result).toBeUndefined();
    });

    it('returnerer likeUkerOgDager dersom erLiktHverUke === true og jobberFasteUkedager === true', () => {
        const result = extractNormalarbeidstid({
            erLikeMangeTimerHverUke: YesOrNo.YES,
            erFasteUkedager: YesOrNo.YES,
            timerFasteUkedager: { monday: { hours: '1', minutes: '30' } },
        });
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
        const result = extractNormalarbeidstid({
            erLikeMangeTimerHverUke: YesOrNo.NO,
            erFasteUkedager: YesOrNo.NO,
            timerFasteUkedager: {},
            timerPerUke: '30',
        });
        expect(result).toBeDefined();
        expect(result?.type).toEqual(NormalarbeidstidType.varierendeUker);
        expect(result?.erLiktHverUke).toBeFalsy();
        if (result?.type === NormalarbeidstidType.varierendeUker) {
            expect(result?.timerPerUkeISnitt).toEqual(30);
            expect((result as any).timerFasteUkedager).toBeUndefined();
        }
    });
});
