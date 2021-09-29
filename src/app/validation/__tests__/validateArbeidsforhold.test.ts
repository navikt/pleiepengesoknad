describe('arbeidsforhold', () => {
    it('is deprecated', () => {
        expect(1).toBe(1);
    });
});

// import { ArbeidsforholdType, JobberSvar } from '../../types';
// import {
//     ArbeidsforholdAnsattApiData,
//     ArbeidsforholdApiNei,
//     ArbeidsforholdApiRedusert,
//     ArbeidsforholdApiSomVanlig,
//     ArbeidsforholdApiVetIkke,
// } from '../../types/PleiepengesøknadApiData';

// import { isArbeidsforholdApiValuesValid } from '../apiValuesValidation';

// const arbeidsforhold: ArbeidsforholdAnsattApiData = {
//     organisasjonsnummer: '123',
//     navn: 'mock',
//     erAnsatt: true,
//     _type: ArbeidsforholdType.ANSATT,
// };

// const arbeidsforholdNei: ArbeidsforholdApiNei & ArbeidsforholdAnsattApiData = {
//     ...arbeidsforhold,
//     skalJobbe: JobberSvar.NEI,
//     jobberNormaltTimer: 10,
// };

// const arbeidsforholdVetIkke: ArbeidsforholdApiVetIkke & ArbeidsforholdAnsattApiData = {
//     ...arbeidsforhold,
//     skalJobbe: JobberSvar.VET_IKKE,
//     jobberNormaltTimer: 10,

// };

// const arbeidsforholdSomVanlig: ArbeidsforholdApiSomVanlig & ArbeidsforholdAnsattApiData = {
//     ...arbeidsforhold,
//     skalJobbe: JobberSvar.JA,
//     jobberNormaltTimer: 10,

// };

// const arbeidsforholdRedusert: ArbeidsforholdApiRedusert & ArbeidsforholdAnsattApiData = {
//     ...arbeidsforhold,
//     skalJobbe: JobberSvar.REDUSERT,
//     jobberNormaltTimer: 10,

// };

// describe('isArbeidsforholdApiValuesValid', () => {
//     describe('validates skalJobbeSomVanlig', () => {
//         it('has success when timer=10', () => {
//             expect(isArbeidsforholdApiValuesValid(arbeidsforholdSomVanlig)).toBeTruthy();
//         });
//         it('has fails when timer < 0', () => {
//             expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdSomVanlig, jobberNormaltTimer: -1 })).toBeFalsy();
//         });
//         it('has success when timer > 100', () => {
//             expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdSomVanlig, jobberNormaltTimer: 101 })).toBeFalsy();
//         });
//         it('has fails when skalJobbeProsent is not 100%', () => {
//             expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdSomVanlig, skalJobbeProsent: 99 })).toBeFalsy();
//         });
//         it('has success when skalJobbeProsent is 100%', () => {
//             expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdSomVanlig, skalJobbeProsent: 100 })).toBeTruthy();
//         });
//     });
//     it('validates skalJobbeRedusert', () => {
//         expect(isArbeidsforholdApiValuesValid(arbeidsforholdRedusert)).toBeTruthy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, jobberNormaltTimer: -1 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, jobberNormaltTimer: 101 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, skalJobbeProsent: 0 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, skalJobbeProsent: 100 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, skalJobbeProsent: 0.1 })).toBeTruthy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdRedusert, skalJobbeProsent: 99.9 })).toBeTruthy();
//     });
//     it('validates skalJobbeVetIkke', () => {
//         expect(isArbeidsforholdApiValuesValid(arbeidsforholdVetIkke)).toBeTruthy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, jobberNormaltTimer: -1 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, jobberNormaltTimer: 101 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, skalJobbeProsent: 1 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, skalJobbeProsent: 99 })).toBeFalsy();
//     });
//     it('validates skalIkkeJobbe', () => {
//         expect(isArbeidsforholdApiValuesValid(arbeidsforholdNei)).toBeTruthy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, jobberNormaltTimer: -1 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, jobberNormaltTimer: 101 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, skalJobbeProsent: 1 })).toBeFalsy();
//         expect(isArbeidsforholdApiValuesValid({ ...arbeidsforholdNei, skalJobbeProsent: 99 })).toBeFalsy();
//     });
// });
