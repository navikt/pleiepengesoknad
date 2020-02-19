import { Næringstype, Virksomhet } from 'common/forms/virksomhet/types';
import { mapVirksomhetToVirksomhetApiData } from '../mapVirksomhetToApiData';

const formData: Partial<Virksomhet> = {
    næringstyper: [Næringstype.ANNET]
};

describe('mapVirksomhetToApiData', () => {
    it('should verify required fields to be mapped', () => {
        const apiData = mapVirksomhetToVirksomhetApiData(formData as Virksomhet);
        expect(apiData.naringstype.length).toBe(1);
    });
});
