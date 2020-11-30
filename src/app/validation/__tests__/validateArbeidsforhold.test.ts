import {
    ArbeidsforholdApi,
    ArbeidsforholdApiNei,
    ArbeidsforholdApiRedusert,
    ArbeidsforholdApiSomVanlig,
    ArbeidsforholdApiVetIkke,
} from '../../types/PleiepengesøknadApiData';

import { isArbeidsforholdApiValuesValid } from '../apiValuesValidation';

const arbeidsforhold: ArbeidsforholdApi = {
    organisasjonsnummer: '123',
    navn: 'mock',
};

const arbeidsforholdNei: ArbeidsforholdApiNei = {
    ...arbeidsforhold,
    skalJobbe: 'nei',
    jobberNormaltTimer: 10,
};

const arbeidsforholdVetIkke: ArbeidsforholdApiVetIkke = {
    ...arbeidsforhold,
    skalJobbe: 'vetIkke',
    jobberNormaltTimer: 10,
};

const arbeidsforholdSomVanlig: ArbeidsforholdApiSomVanlig = {
    ...arbeidsforhold,
    skalJobbe: 'ja',
    jobberNormaltTimer: 10,
};

const arbeidsforholdRedusert: ArbeidsforholdApiRedusert = {
    ...arbeidsforhold,
    skalJobbe: 'redusert',
    jobberNormaltTimer: 10,
    skalJobbeProsent: 50,
};

describe('isArbeidsforholdApiValuesValid', () => {
    describe('validates skalJobbeSomVanlig', () => {
        it('has success when timer=10', () => {
            expect(isArbeidsforholdApiValuesValid(arbeidsforholdSomVanlig)).toBeTruthy();
        });
        it('has fails when timer < 0', () => {
            expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdSomVanlig, jobberNormaltTimer: -1 })).toBeFalsy();
        });
        it('has success when timer > 100', () => {
            expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdSomVanlig, jobberNormaltTimer: 101 })).toBeFalsy();
        });
    });
    it('validates skalJobbeRedusert', () => {
        expect(isArbeidsforholdApiValuesValid(arbeidsforholdRedusert)).toBeTruthy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, jobberNormaltTimer: -1 })).toBeFalsy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, jobberNormaltTimer: 101 })).toBeFalsy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, skalJobbeProsent: 0 })).toBeFalsy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, skalJobbeProsent: 100 })).toBeFalsy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, skalJobbeProsent: 0.1 })).toBeTruthy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, skalJobbeProsent: 99.9 })).toBeTruthy();
    });
    it('validates skalJobbeVetIkke', () => {
        expect(isArbeidsforholdApiValuesValid(arbeidsforholdVetIkke)).toBeTruthy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, jobberNormaltTimer: -1 })).toBeFalsy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, jobberNormaltTimer: 101 })).toBeFalsy();
    });
    it('validates skalIkkeJobbe', () => {
        expect(isArbeidsforholdApiValuesValid(arbeidsforholdNei)).toBeTruthy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, jobberNormaltTimer: -1 })).toBeFalsy();
        expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, jobberNormaltTimer: 101 })).toBeFalsy();
    });
});
