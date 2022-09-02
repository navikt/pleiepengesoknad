import { ArbeidIPeriodeType } from '../../../../types/arbeidIPeriodeType';
import { ArbeidIPeriodeSøknadsdata } from '../../../../types/søknadsdata/arbeidIPeriodeSøknadsdata';
import {
    NormalarbeidstidSøknadsdata,
    NormalarbeidstidType,
} from '../../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import { erArbeidsforholdMedFravær } from '../arbeidstidUtils';

const normalarbeidstid: NormalarbeidstidSøknadsdata = {
    type: NormalarbeidstidType.likeUkerOgDager,
    erFasteUkedager: true,
    erLiktHverUke: true,
    timerFasteUkedager: {
        friday: { hours: '1', minutes: '0' },
    },
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

const arbeiderRedusertEnkeltdager: ArbeidIPeriodeSøknadsdata = {
    type: ArbeidIPeriodeType.arbeiderEnkeltdager,
    arbeiderIPerioden: true,
    arbeiderRedusert: true,
    enkeltdager: { '123123': { hours: '1', minutes: '0' } },
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
                    arbeidISøknadsperiode: arbeiderRedusertEnkeltdager,
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
});
