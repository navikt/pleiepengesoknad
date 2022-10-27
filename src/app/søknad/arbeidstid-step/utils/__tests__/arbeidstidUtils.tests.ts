import { DateRange } from '@navikt/sif-common-formik/lib';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../../../../types/arbeidIPeriodeType';
import { ArbeidIPeriodeSøknadsdata } from '../../../../types/søknadsdata/arbeidIPeriodeSøknadsdata';
import { NormalarbeidstidSøknadsdata } from '../../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import {
    AktivtArbeidsforholdVarighetType,
    erArbeidsforholdMedFravær,
    getAktivArbeidsforholdVarighetType,
    summerArbeidstimerIArbeidsuker,
} from '../arbeidstidUtils';

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
        it('returnerer 0 ved 0 timer', () => {
            const result = summerArbeidstimerIArbeidsuker({ a: { timer: 0 } });
            expect(result).toEqual(0);
        });
        it('summerer riktig', () => {
            const result = summerArbeidstimerIArbeidsuker({
                a: { timer: 1 },
                b: { timer: 2 },
                c: { timer: 3 },
            });
            expect(result).toEqual(6);
        });
    });

    describe('getAktivArbeidsforholdVarighetType', () => {
        const søknadsperiode: DateRange = {
            from: ISODateToDate('2022-01-03'),
            to: ISODateToDate('2022-01-16'),
        };
        const førSøknadsperiode = ISODateToDate('2022-01-01');
        const iSøknadadsperiode = ISODateToDate('2022-01-05');
        const etterSøknadsperiode = ISODateToDate('2022-01-19');

        it('returnerer riktig når aktiv periode dekker hele søknadsperioden', () => {
            expect(
                getAktivArbeidsforholdVarighetType(søknadsperiode, { from: førSøknadsperiode, to: etterSøknadsperiode })
            ).toEqual(AktivtArbeidsforholdVarighetType.gjelderHelePerioden);
        });
        it('returnerer riktig når aktiv periode starter i men og slutter etter søknadsperiode', () => {
            expect(
                getAktivArbeidsforholdVarighetType(søknadsperiode, { from: iSøknadadsperiode, to: etterSøknadsperiode })
            ).toEqual(AktivtArbeidsforholdVarighetType.starterIPeriode);
        });
        it('returnerer riktig når aktiv periode starter før men slutter i søknadsperiode', () => {
            expect(
                getAktivArbeidsforholdVarighetType(søknadsperiode, { from: førSøknadsperiode, to: iSøknadadsperiode })
            ).toEqual(AktivtArbeidsforholdVarighetType.slutterIPeriode);
        });
        it('returnerer riktig når aktiv periode starter i og slutter i søknadsperiode', () => {
            expect(
                getAktivArbeidsforholdVarighetType(søknadsperiode, { from: iSøknadadsperiode, to: iSøknadadsperiode })
            ).toEqual(AktivtArbeidsforholdVarighetType.starterOgSlutterIPeriode);
        });
        it('returnerer riktig når aktiv periode starter  og slutter før søknadsperiode', () => {
            expect(
                getAktivArbeidsforholdVarighetType(søknadsperiode, { from: førSøknadsperiode, to: førSøknadsperiode })
            ).toEqual(AktivtArbeidsforholdVarighetType.utenforPeriode);
        });
        it('returnerer riktig når aktiv periode starter  og slutter etter søknadsperiode', () => {
            expect(
                getAktivArbeidsforholdVarighetType(søknadsperiode, {
                    from: etterSøknadsperiode,
                    to: etterSøknadsperiode,
                })
            ).toEqual(AktivtArbeidsforholdVarighetType.utenforPeriode);
        });
    });
});
