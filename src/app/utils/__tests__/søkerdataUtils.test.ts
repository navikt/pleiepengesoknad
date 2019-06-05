import { harRegistrerteBarn } from '../søkerdataUtils';
import { BarnReceivedFromApi, Søkerdata } from '../../types/Søkerdata';

const barnMock: Partial<BarnReceivedFromApi> = {
    fornavn: 'Ola'
};

describe('søkerdataUtils', () => {
    describe('harRegistrerteBarn', () => {
        it('should return true if barn-array length his greater than 0', () => {
            const søkerdata: Partial<Søkerdata> = { barn: [barnMock as BarnReceivedFromApi] };
            expect(harRegistrerteBarn(søkerdata as Søkerdata)).toBe(true);
        });

        it('should return false if barn array is missing or length is 0', () => {
            const søkerdata: Partial<Søkerdata> = { barn: undefined };
            expect(harRegistrerteBarn(søkerdata as Søkerdata)).toBeFalsy();
            søkerdata.barn = [];
            expect(harRegistrerteBarn(søkerdata as Søkerdata)).toBeFalsy();
        });
    });
});
