import { getFormValuesFromInnsendtSøknad } from '../getFormValuesFromInnsendtSøknad';

describe('getFormValuesFromInnsendtSøknad', () => {
    it('returnerer undefined dersom det ikke er noen registrerte barn på søker', () => {
        expect(getFormValuesFromInnsendtSøknad({} as any, [])).toBeUndefined();
    });
});
