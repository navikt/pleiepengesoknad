import { importForrigeSøknad } from '../importForrigeSøknad';

describe('getFormValuesFromInnsendtSøknad', () => {
    it('returnerer undefined dersom det ikke er noen registrerte barn på søker', () => {
        expect(importForrigeSøknad({} as any, [])).toBeUndefined();
    });
});
