import { getFormValuesFromApiData } from '../getFormValuesFromApiData';

describe('getFormValuesFromApiData', () => {
    it('returnerer undefined dersom det ikke er noen registrerte barn på søker', () => {
        expect(getFormValuesFromApiData({} as any, [])).toBeUndefined();
    });
});
