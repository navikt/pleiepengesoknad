import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { extractNormalarbeidstid } from '../extractNormalarbeidstidSøknadsdata';

describe('extractNormalarbeidstid', () => {
    it('returnerer undefined dersom normalarbeidstid === undefined', () => {
        expect(extractNormalarbeidstid(undefined)).toBeUndefined();
    });
    it('returnerer undefined dersom erLiktHverUke === undefined', () => {
        expect(
            extractNormalarbeidstid({
                erLiktHverUke: undefined,
                fasteDager: undefined,
                timerPerUke: undefined,
            })
        ).toBeUndefined();
    });
    it('returnerer undefined dersom erLiktHverUke === false && timerPerUke er ugyldig', () => {
        const result = extractNormalarbeidstid({
            erLiktHverUke: YesOrNo.NO,
            timerPerUke: 'abc',
        });
        expect(result).toBeUndefined();
    });

    it('returnerer faste dager og beregnet timerPerUke dersom erLiktHverUke === true og det ikke er likt hver dag', () => {
        const result = extractNormalarbeidstid({
            erLiktHverUke: YesOrNo.YES,
            liktHverDag: YesOrNo.NO,
            fasteDager: { monday: { hours: '1', minutes: '30' } },
        });
        expect(result).toBeDefined();
        expect(result?.erLiktHverUke).toBeTruthy();
        expect(result?.timerPerUke).toEqual(1.5);
        expect(result?.fasteDager.monday?.hours).toEqual('1');
        expect(result?.fasteDager.monday?.minutes).toEqual('30');
    });
    it('returnerer timerPerUke og fordelt timer per fasteDager dersom erLiktHverUke === false og timerPerUke er satt', () => {
        const result = extractNormalarbeidstid({
            erLiktHverUke: YesOrNo.NO,
            fasteDager: undefined,
            timerPerUke: '30',
        });
        expect(result).toBeDefined();
        expect(result?.erLiktHverUke).toBeFalsy();
        expect(result?.timerPerUke).toEqual(30);
        expect(result?.fasteDager.monday?.hours).toEqual('6');
        expect(result?.fasteDager.monday?.minutes).toEqual('0');
    });
});
