import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { extractNormalarbeidstid } from '../extractNormalarbeidstidSøknadsdata';

describe('extractNormalarbeidstid', () => {
    describe('ArbeidsforholdType.ANSATT', () => {
        it('returnerer undefined dersom normalarbeidstid === undefined', () => {
            expect(extractNormalarbeidstid(undefined, ArbeidsforholdType.ANSATT)).toBeUndefined();
        });

        it('returnerer timerPerUke riktig', () => {
            const result = extractNormalarbeidstid(
                {
                    timerPerUke: '30',
                },
                ArbeidsforholdType.ANSATT
            );
            expect(result).toBeDefined();
            expect(result?.timerPerUkeISnitt).toEqual(30);
        });
    });
});
