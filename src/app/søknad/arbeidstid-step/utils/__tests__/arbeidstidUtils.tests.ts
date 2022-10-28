import { ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../../../../types/arbeidIPeriodeType';
import { ArbeidIPeriodeSøknadsdata } from '../../../../types/søknadsdata/arbeidIPeriodeSøknadsdata';
import { NormalarbeidstidSøknadsdata } from '../../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import { erArbeidsforholdMedFravær, summerArbeidstimerIArbeidsuker } from '../arbeidstidUtils';

const normalarbeidstid: NormalarbeidstidSøknadsdata = {
    timerPerUkeISnitt: 20,
};

const arbeiderIkke: ArbeidIPeriodeSøknadsdata = {
    type: ArbeidIPeriodeType.arbeiderIkke,
    arbeiderIPerioden: false,
};

const arbeiderVanlig: ArbeidIPeriodeSøknadsdata = {
    type: ArbeidIPeriodeType.arbeiderVanlig,
    arbeiderIPerioden: true,
    arbeiderRedusert: false,
};

const arbeiderRedusert: ArbeidIPeriodeSøknadsdata = {
    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
    arbeiderIPerioden: true,
    arbeiderRedusert: true,
    timerISnittPerUke: 5,
};

describe('arbeidstidUtils', () => {
    describe('erArbeidsforholdMedFravær', () => {
        it('returner true når en ikke arbeiderer i perioden', () => {
            expect(
                erArbeidsforholdMedFravær({
                    normalarbeidstid,
                    arbeidISøknadsperiode: arbeiderIkke,
                })
            ).toBeTruthy();
        });
        it('returner true når en arbeider redusert i perioden', () => {
            expect(
                erArbeidsforholdMedFravær({
                    normalarbeidstid,
                    arbeidISøknadsperiode: arbeiderRedusert,
                })
            ).toBeTruthy();
        });
        it('returner false når en arbeider som vanlig', () => {
            expect(
                erArbeidsforholdMedFravær({
                    normalarbeidstid,
                    arbeidISøknadsperiode: arbeiderVanlig,
                })
            ).toBeFalsy();
        });
    });

    describe('summerArbeidstimerIArbeidsuker', () => {
        const periode = ISODateRangeToDateRange('2022-01-03/2022-01-09');
        it('returnerer 0 ved 0 timer', () => {
            const result = summerArbeidstimerIArbeidsuker([{ periode, timer: 0 }]);
            expect(result).toEqual(0);
        });
        it('summerer riktig', () => {
            const result = summerArbeidstimerIArbeidsuker([
                { periode, timer: 1 },
                { periode, timer: 2 },
                { periode, timer: 3 },
            ]);
            expect(result).toEqual(6);
        });
    });
});
