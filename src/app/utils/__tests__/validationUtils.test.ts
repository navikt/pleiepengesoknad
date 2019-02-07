import { welcomingPageIsValid } from '../validationUtils';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

describe('validationHelper tests', () => {
    describe('welcomingPage', () => {
        it('should be valid if harGodkjentVilkår is true', () => {
            const formData = { harGodkjentVilkår: true };
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(true);
        });

        it('should be invalid if harGodkjentVilkår is undefined or false', () => {
            let formData = {};
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            formData = { harGodkjentVilkår: false };
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });
    });

    describe('opplysninger om barnet-step', () => {
        it('should get validity from validateRelasjonTilBarnet if barnetHarIkkeFåttFødselsnummerEnda', () => {});
    });
});
