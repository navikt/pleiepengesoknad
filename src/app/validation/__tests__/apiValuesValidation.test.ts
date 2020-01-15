import { apiVedleggIsInvalid } from '../apiValuesValidation';

describe('apiVedleggIsInvalid', () => {
    it('should return error if vedlegg[] is empty', () => {
        expect(apiVedleggIsInvalid([])).toBeDefined();
    });
    it('should return error if vedlegg[] contains nulls', () => {
        const nullString: any = null;
        expect(apiVedleggIsInvalid([nullString])).toBeDefined();
    });
    it('should return error if vedlegg[] contains empty strings', () => {
        expect(apiVedleggIsInvalid([''])).toBeDefined();
    });
    it('should return error if vedlegg[] contains undefined', () => {
        const undefinedString: any = undefined;
        expect(apiVedleggIsInvalid([undefinedString])).toBeDefined();
    });
});
