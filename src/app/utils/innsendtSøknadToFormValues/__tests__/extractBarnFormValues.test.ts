import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { RegistrerteBarn } from '../../../types';
import { SøknadFormField } from '../../../types/SøknadFormValues';
import { extractBarnFormValues } from '../extractBarnFormValues';

const registrerteBarn: RegistrerteBarn[] = [
    { aktørId: '111' },
    { aktørId: '222', fødselsdato: ISODateToDate('2020-02-02') },
    { aktørId: '333', fødselsdato: ISODateToDate('2020-03-03') },
    { aktørId: '444', fødselsdato: ISODateToDate('2020-03-03') },
] as RegistrerteBarn[];

describe('extractBarnFormValues', () => {
    it('returnerer undefined dersom aktørid er undefined og fødselsdato ikke matcher', () => {
        expect(
            extractBarnFormValues({ aktørId: undefined, fødselsdato: '2020-01-01' }, registrerteBarn)
        ).toBeUndefined();
    });
    it('returnerer undefined dersom barns aktørId ikke er blant registrerte barn', () => {
        const result = extractBarnFormValues(
            {
                aktørId: '000',
                fødselsdato: '2020-01-01',
            },
            registrerteBarn
        );
        expect(result).toBeUndefined();
    });
    it(`returnerer ${SøknadFormField.barnetSøknadenGjelder} dersom barns aktørid er blant registrerte barn`, () => {
        const result = extractBarnFormValues(
            {
                aktørId: '111',
                fødselsdato: '2020-01-01',
            },
            registrerteBarn
        );
        expect(result).toBeDefined();
        expect(result?.barnetSøknadenGjelder).toEqual('111');
    });
    it(`returnerer ${SøknadFormField.barnetSøknadenGjelder} dersom aktørid er undefined og det er ett registrert barn med samme fødselsdato`, () => {
        const result = extractBarnFormValues(
            {
                fødselsdato: '2020-02-02',
            },
            registrerteBarn
        );
        expect(result).toBeDefined();
        expect(result?.barnetSøknadenGjelder).toEqual('222');
    });
    it(`returnerer undefined dersom aktørid er undefined og det er registrert flere barn med samme fødselsdato`, () => {
        const result = extractBarnFormValues(
            {
                fødselsdato: '2020-03-03',
            },

            registrerteBarn
        );
        expect(result).toBeUndefined();
    });
});
