import { RegistrerteBarn } from '../../../types';
import { SøknadApiData } from '../../../types/søknad-api-data/SøknadApiData';
import { SøknadFormField } from '../../../types/SøknadFormValues';
import { extractBarnFormValues } from '../extractBarnFormValues';
import { getFormValuesFromApiData } from '../getFormValuesFromApiData';

const registrerteBarn: RegistrerteBarn[] = [{ aktørId: '123' }] as RegistrerteBarn[];

describe('extractBarnFormValues', () => {
    it('returnerer undefined dersom aktørid er undefined', () => {
        expect(extractBarnFormValues({ aktørId: undefined }, registrerteBarn)).toBeUndefined();
    });
    it('returnerer undefined dersom barns aktørId ikke er blant registrerte barn', () => {
        const result = getFormValuesFromApiData(
            {
                barn: {
                    aktørId: '000',
                },
            } as SøknadApiData,
            registrerteBarn
        );
        expect(result).toBeUndefined();
    });
    it(`returnerer ${SøknadFormField.barnetSøknadenGjelder} dersom barns aktørid er blant registrerte barn`, () => {
        const result = getFormValuesFromApiData(
            {
                barn: {
                    aktørId: '123',
                },
            } as SøknadApiData,
            registrerteBarn
        );
        expect(result).toBeDefined();
        expect(result?.barnetSøknadenGjelder).toEqual('123');
    });
});
